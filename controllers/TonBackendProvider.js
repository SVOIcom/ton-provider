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


class TonBackendProvider extends _App {

    async index() {
        return 'TonBackendProvider';
    }

    async runLocal(networkServer = 'main2.ton.dev', address, method) {
        let TON = await require('../modules/utils/TON')(networkServer)

        try {
            let result = await TON.runLocal(address, this.post.abi, method, this.post.input);

            return {status: 'ok', result}
        } catch (e) {
            return {status: 'error', error: e.message, encodedError: JSON.stringify(e)};
        }


    }


    async config() {
        return {};
    }

}

module.exports = TonBackendProvider;