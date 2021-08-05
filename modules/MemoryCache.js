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
const sharedCache = require('node-shared-cache-x');


module.exports = function (cacheName = 'sharedCache') {
    let cache = new sharedCache.Cache(cacheName, 557056000, 14);

    let timers = {};


    return {
        /**
         * Использовать кеш
         * @param key
         * @param dataCallback
         * @param timeout
         * @returns {Promise<*>}
         */
        load: async function (key, dataCallback, timeout = 3000) {
            let cachedValue = cache[key];
            if(cachedValue !== undefined) {
                return cachedValue;
            }

            let fnResult = await dataCallback();

            cache[key] = fnResult;

            timers[key] = setTimeout(() => {
                cache[key] = undefined;
                timers[key] = undefined;
                delete cache[key];
                delete timers[key];
            }, timeout);


            return fnResult;
        },
        /**
         * Сбросить кеш
         * @param key
         */
        reset(key) {
            if(cache[key] !== undefined) {
                clearTimeout(timers[key]);
                cache[key] = undefined;
                delete cache[key];
                timers[key] = undefined;
                delete timers[key];
            }
        }
    }
};