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
const _App = require('./_App');


class Index extends _App {

    async index() {

        return await this.render();
    }


    async config() {
        return {};
    }

    async setTheme(theme) {
        await this.session.write('theme', theme);
        return {};
    }

    async getTheme() {
        return {theme: await this.session.read('theme', 'light')};
    }
}

module.exports = Index;