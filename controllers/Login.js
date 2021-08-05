/**
 * Login controloler
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const _App = require('./_App');

const crypto = require('crypto');

const {Crypto, Email} = require('favorito');

const {registrationEmail} = require('../modules/Emails/Emails');

//const Users = require('../models/Users');



class Login extends _App {

    /**
     * Логин
     * @returns {Promise<*|void|Response>}
     */
    async index() {
        this.setTitle('Login');

        if(this.isPost()) {

            let passwordHash = this.hash(this.post.password);
            let user = await this.db.users.checkAuth(this.post.login, passwordHash);
            if(user) {
                if(user.status === Users.USER_STATUS.verified) {
                    this._loginUser(user);
                    return this.redirect('/dashboard');
                } else {
                    await this.showErrorBadge('Unverified email.');
                }
            } else {
                await this.showErrorBadge('Invalid email or password or user ');
            }
        }

        return await this.render('login.twig');
    }

    /**
     * Регистрация
     * @returns {Promise<*|void|Response>}
     */
    async register() {

        this.setTitle('Sign up');

        if(this.isPost()) {


            await this.tset('name', this.post.name);
            await this.tset('phone', this.post.phone);
            await this.tset('email', this.post.email);

            if(this.post.password !== this.post.password2) {
                await this.showErrorBadge('Password repeat is invalid');
                return await this.render();
            }

            try {
                let newUser = await this.db.users.create(this.post.email, this.hash(this.post.password), {
                    name: this.post.name,
                    phone: this.post.phone,
                    country: this.post.country
                });
                try {
                    await registrationEmail(this.email, this.post.email, this.post.name, this._generateUserUrl(newUser.id));
                } catch (e) {
                    console.log(e);
                    await this.showErrorBadge('Error while sending email');
                    return await this.render();
                }
                //console.log('USER CREATED', newUser);
                await this.showOkBadge('We send verification email. Check you inbox for verification link');
                //console.log('VERIFY LINK', this._generateUserUrl(newUser.id));
                return this.redirect('/login');
            } catch (e) {
                await this.showErrorBadge('This email already exists');
                return await this.render();
            }

        }


        return await this.render();
    }

    /**
     * Выход из аккаунта
     * @returns {Promise<*|void|Response>}
     */
    async logout() {
        await this.session.clear();
        await this.showOkBadge('Session terminated');
        return this.redirect('/login');
    }

    /**
     * Accept user
     * @param code
     * @return {Promise<void>}
     */
    async accept(code) {
        if(code) {
            try {
                let object = JSON.parse(Crypto.decrypt(code, this.config.secret));
                if(object.expire < +new Date()) {
                    await this.showErrorBadge('Link expired');
                    return this.render('login');
                }

                await this.db.users.changeStatus(object.userId, Users.USER_STATUS.verified);

                await this.showOkBadge('Account accepted. Now you can login');

                return this.redirect('/login');

            } catch (e) {
                await this.showErrorBadge('Invalid link');
                return this.redirect('/login');
            }
        }
        return this.redirect('/login');
    }

}

module.exports = Login;
