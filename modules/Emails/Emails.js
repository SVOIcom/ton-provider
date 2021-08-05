/**
 * Part of HomeOffice project
 * Emails list
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const Twig = require('twig'), twig = Twig.twig;

const fs = require('fs');
module.exports = {
    /**
     *
     * @param {Email} mailer
     * @param {string} email
     * @param {string} name
     * @param {string} url
     * @return {Promise<void>}
     */
    registrationEmail: async (mailer, email, name, url) => {
        console.log('REGISTER EMAIL', email, url);
        return await mailer.sendHtml(email, 'Подтвердите ваш Email', twig({ data: fs.readFileSync(__dirname + '/templates/registrationEmail.twig').toString() }).render({
            name,
            url
        }));
    },

    restoreEmail: async (mailer, email, url) => {
        console.log('RESTORE EMAIL', email, url);
        return await mailer.sendHtml(email, 'Восстановление пароля', twig({ data: fs.readFileSync(__dirname + '/templates/restoreEmail.twig').toString() }).render({
            url
        }));
    },

    /**
     *
     * @param mailer
     * @param email
     * @param companyName
     * @param url
     * @return {Promise<void|*>}
     */
    inviteEmail: async (mailer, email, companyName, url) => {
        console.log('INVITE EMAIL', email, companyName, url);
        return await mailer.sendHtml(email, 'Вас пригласили в компанию проекта Удаленка.онлайн', twig({ data: fs.readFileSync(__dirname + '/templates/intiteEmail.twig').toString() }).render({
            companyName,
            url
        }));
    },

    /**
     *
     * @param mailer
     * @param email
     * @param companyName
     * @param url
     * @return {Promise<void|*>}
     */
    inviteEmailToRegisteredUser: async (mailer, email, companyName) => {
        console.log('INVITE EMAIL TO REGISTERED', email, companyName);
        return await mailer.sendHtml(email, 'Вы были добавлены в компанию ' + companyName, twig({ data: fs.readFileSync(__dirname + '/templates/inviteEmailToRegisteredUser.twig').toString() }).render({
            companyName
        }));
    }
};