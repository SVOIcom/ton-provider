/*_______ ____  _   _  _____
 |__   __/ __ \| \ | |/ ____|
    | | | |  | |  \| | (_____      ____ _ _ __
    | | | |  | | . ` |\___ \ \ /\ / / _` | '_ \
    | | | |__| | |\  |____) \ V  V / (_| | |_) |
    |_|  \____/|_| \_|_____/ \_/\_/ \__,_| .__/
                                         | |
                                         |_| */
/**
 * @name TONSwap project - tonswap.com
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 */
const {_Controller} = require('favorito');


const cache = require('../modules/MemoryCache');

class _App extends _Controller {

    constructor(app, db, config, parent, controllerName) {
        super(app, db, config, parent, controllerName);

        this.layoutName = 'layout.twig';

        this.badgeMessages = [];
        this.subTitle = 'TONLend';

        this.controllerPageName = '';
        this.controllerIndexPageUrl = '';
        this.actionPageName = '';

        this.cache = cache(config.sharedCacheName);
    }

    /**
     * Before render
     * @return {Promise<void>}
     * @private
     */
    async _beforeRender() {
        await super._beforeRender();
        this.tset('layoutName', this.layoutName);
        this.tset('controllerName', this.controllerName);
        this.tset('explorerUrl', this.config.explorerUrl);
        this.tset('theme', await this.session.read('theme', 'light'));
        this.tset('config', JSON.stringify({network: this.config.network}))
    }

    async _beforeAction() {
        await super._beforeAction();
        //Check is session active
        if(!await this.session.isActive()) {
            await this.session.clear();
        }

        //Setup current user
        this.user = false;
        if(await this.session.get('userId')) {
            this.user = await this.session.get('userId');
        }

        this.badgeMessages = await this.session.read('badge', []);
        this._updateBadgesMessages();

    }

    /**
     * Change layout
     * @param newLayout
     */
    changeLayout(newLayout) {
        this.layoutName = newLayout;
    }


    /**
     * Update template badge messages field
     * @private
     */
    _updateBadgesMessages() {
        this.tset('badgeMessages', this.badgeMessages);
    }

    /**
     * Show badge
     * @param {string} type
     * @param {string} message
     * @private
     */
    async _showBadge(type = 'error', message = '') {
        this.badgeMessages.push({type: type, message: message});

        await this.session.write('badge', this.badgeMessages);
        this._updateBadgesMessages();
    }

    /**
     * Show error badge message
     * @param errorMessage
     */
    async showErrorBadge(errorMessage) {
        await this._showBadge('error', errorMessage)
    }

    /**
     * Show ok badge
     * @param message
     */
    async showOkBadge(message) {
        await this._showBadge('ok', message)
    }

    /**
     * Show warning badge
     * @param message
     */
    async showWarningBadge(message) {
        await this._showBadge('warning', message)
    }


    /**
     * @inheritDoc
     */
    async render(template, params) {
        await this._updateBadgesMessages();
        await this.session.write('badge', []);
        return await super.render(template, params);
    }


    /**
     * Set page title
     * @param main
     * @param subTitle
     */
    setTitle(main, subTitle = this.subTitle) {
        this.tset('title', main + ' — ' + subTitle);
        this.actionPageName = main;
        this.tset('actionPageName', this.actionPageName);
    }

    /**
     * Set breadcrumbs config
     * @param {string} pageName
     * @param {string} indexPageUrl
     */
    setControllerPage(pageName, indexPageUrl) {
        this.controllerPageName = pageName;
        this.controllerIndexPageUrl = indexPageUrl;

        this.tset('controllerPageName', this.controllerPageName);
        this.tset('controllerIndexPageUrl', this.controllerIndexPageUrl);
        this.tset('actionPageName', this.actionPageName);
    }

    /**
     * Return default database
     * @returns {Database}
     */
    get db() {
        return this.app.db.get();
    }


    /**
     * Save user session
     * @param user
     * @return {Promise<void>}
     * @protected
     */
    async _loginUser(user) {
        this.user = user;
        await this.session.write('userId', user);
    }

    /**
     * Check authorization
     * @return {Promise<boolean>}
     */
    async authorized() {
        if(!this.user) {
            await this.showWarningBadge('Сессия истекла');
            await this.redirect('/login');
            return false;
        }

        return true;
    }

    /**
     * Получить текущий ip пользователя
     * @returns {Promise<*|string>}
     */
    async getUserIp(){
        return this.req.headers['x-forwarded-for'] || this.req.connection.remoteAddress
    }

}

module.exports = _App;