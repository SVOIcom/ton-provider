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
 * @version 1.0
 */

const fetch = require('node-fetch');
const TokenDataResolver = require('./TokenDataResolver')
const KeyValue = require('../../../models/KeyValue');
const utils = require('../../utils/utils');

const BROXUS_TOKEN_LIST_URL = 'https://raw.githubusercontent.com/broxus/ton-assets/master/manifest.json';
const BROXUS_CHAIN_ID_2_NETWORK = {
    '1':'main',
}

class TokensList {
    //constructor(listUrl = 'https://explorer.tonswap.com/json/tokensList.json') {
    constructor(listUrl = 'http://localhost:3002/json/tokensList.json') {
        this.listUrl = listUrl;
        this.name = '';
        this.version = '';
        this.url = '';
        this.tokens = [];
        this.isLoaded = false;
    }

    /**
     * Load token list
     * @returns {Promise<TokensList>}
     */
    async load(network = 'main') {
        let listJSON = await ((await fetch(this.listUrl))).json();
        for (let key of Object.keys(listJSON)) {
            this[key] = listJSON[key];
        }

        let newTokens = [];

        for (let token of this.tokens) {
            if(token.network === network) {
                newTokens.push(token);
            }
        }

        //Load broxus list
        listJSON = await ((await fetch(BROXUS_TOKEN_LIST_URL))).json();

        listJSON=listJSON.tokens;

        for (let token of listJSON) {
            //console.log(token);
            if(BROXUS_CHAIN_ID_2_NETWORK[token.chainId] === network) {
                newTokens.push({
                    "network": BROXUS_CHAIN_ID_2_NETWORK[token.chainId],
                    "rootAddress": token.address,
                    "name": token.name,
                    "symbol": token.symbol,
                    "decimals": token.decimals,
                    "config": {},
                    "icon": token.logoURI
                });
            }
        }

        console.log(newTokens);



        this.tokens = newTokens;
        this.isLoaded = true;

        return this;
    }

    /**
     * Get full tokenlist
     * @returns {Promise<[]>}
     */
    async getTokens() {
        return this.tokens;
    }

    /**
     * Get token by root address
     * @param {string} rootAddress
     * @returns {Promise<*>}
     */
    async getTokenByRootAddress(rootAddress) {
        for (let token of this.tokens) {
            if(token.rootAddress === rootAddress) {
                return token;
            }
        }

        //Token not found in list

        let tokenInfo = await KeyValue.get(rootAddress);

        try {
            if(!tokenInfo) {
                let tokenResolver = await (new TokenDataResolver()).init(rootAddress);
                let tokenData = await tokenResolver.getTokenDetails();

                tokenInfo = {
                    "rootAddress": rootAddress,
                    "name": utils.hex2String(tokenData.name),
                    "symbol": utils.hex2String(tokenData.symbol),
                    "decimals": Number(tokenData.decimals),
                    "config": {},
                    "icon": ""
                };

                await KeyValue.set(rootAddress, tokenInfo);
            }

            return tokenInfo;
        } catch (e) {
            return undefined;
        }
    }
}

module.exports = TokensList;