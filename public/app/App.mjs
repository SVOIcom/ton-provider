/*
  _______          _____                _     _
 |__   __|        |  __ \              (_)   | |
    | | ___  _ __ | |__) | __ _____   ___  __| | ___ _ __
    | |/ _ \| '_ \|  ___/ '__/ _ \ \ / / |/ _` |/ _ \ '__|
    | | (_) | | | | |   | | | (_) \ V /| | (_| |  __/ |
    |_|\___/|_| |_|_|   |_|  \___/ \_/ |_|\__,_|\___|_|
 */
/**
 * @name FreeTON connection provider
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */


import {default as getProvider, PROVIDERS} from "/freeton/getProvider.mjs";
import CONFIG from "./config.mjs";



async function main() {


    /**
     * Initialize TON
     * @type {TonWallet}
     */
    let TON = null;
    try {

        if(!localStorage.wallet) {
            throw 'NoWalletSelected';
        }

        //Initialize provider
        TON = await getProvider({}, localStorage.wallet)//.init();
        await TON.requestPermissions();
        await TON.start();

        let wallet = await TON.getWallet();

    } catch (e) {
        console.log(e);
        TON = await getProvider({
            network: CONFIG.defaultNetwork,
            networkServer: CONFIG.defaultNetworkServer
        }, PROVIDERS.TonBackendWeb);
        await TON.requestPermissions();
        await TON.start();

    }
    window.TON = TON;

    /**
     * Disconnect wallets
     * @returns {Promise<void>}
     */
    window.disconnectWallet = async function () {
        delete localStorage.wallet;
        await TON.revokePermissions();
        window.location.href = window.location.href;
    }

    /**
     * Connect crystalWallet
     * @returns {Promise<void>}
     */
    window.connectCrystalWallet = async function () {
        localStorage.wallet = PROVIDERS.CrystalWallet;
        window.location.href = window.location.href;
    }

    /**
     * Connect TonWallet
     * @returns {Promise<void>}
     */
    window.connectTonWallet = async function () {
        localStorage.wallet = PROVIDERS.TonWallet;
        window.location.href = window.location.href;
    }

    window.connectTonWeb = async function () {
        localStorage.wallet = PROVIDERS.TonWeb;
        window.location.href = window.location.href;
    }


}


main();