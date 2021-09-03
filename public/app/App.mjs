/*
  _______ ____  _   _ _                    _
 |__   __/ __ \| \ | | |                  | |
    | | | |  | |  \| | |     ___ _ __   __| |
    | | | |  | | . ` | |    / _ \ '_ \ / _` |
    | | | |__| | |\  | |___|  __/ | | | (_| |
    |_|  \____/|_| \_|______\___|_| |_|\__,_|
 */
/**
 * @name TONLend - DeFi lending for FreeTON
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import PageStack from "./modules/ui/PageStack.mjs";
import utils from "./modules/utils.mjs";
import {default as getProvider, PROVIDERS} from "./modules/freeton/getProvider.mjs";
import CONFIG from "./config.mjs";
import {} from "./modules/misc/TonProviderUi.mjs";
import {} from "./modules/misc/MiscUI.mjs";


async function main() {


    showLoading();


    let pageStack = new PageStack($('#applicationContent'));

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

        $('#connectWalletButton').html(`<img src="${TON.getIconUrl()}" style="height: 30px;"> &nbsp;` + utils.shortenPubkey(wallet.address));

    } catch (e) {
        console.log(e);
        TON = await getProvider({
            network: CONFIG.defaultNetwork,
            networkServer: CONFIG.defaultNetworkServer
        }, PROVIDERS.TonBackendWeb);
        await TON.requestPermissions();
        await TON.start();

    }

    $('#loadingPlaceholder').hide();

    window.TON = TON;


    window.fpageLoadPage = async function (action, controller) {
        if(window.screen.width < 764) {
            $('.sidebar-toggle').click();
        }
        showLoading();
        await pageStack.loadPage(action, controller, {punks: window.punks, TON, CONFIG});
        hideLoading();
    }


    if(window.application) {
        if(window.application.action) {
            await pageStack.loadPage(window.application.action, window.application.controller, {
                ...window.application,
                TON,
                CONFIG
            });

            hideLoading();
        }
    } else {

        window.testPage = await pageStack.loadPage('borrow', 'index', {TON, CONFIG});

        hideLoading();
    }

    $('#applicationContent').show();

}


main();