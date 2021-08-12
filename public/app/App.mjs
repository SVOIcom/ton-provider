/*
  _______ ____  _   _ _                    _
 |__   __/ __ \| \ | | |                  | |
    | | | |  | |  \| | |     ___ _ __   __| |
    | | | |  | | . ` | |    / _ \ '_ \ / _` |
    | | | |__| | |\  | |___|  __/ | | | (_| |
    |_|  \____/|_| \_|______\___|_| |_|\__,_|
 */
import Page from "./modules/ui/Page.mjs";
import PageStack from "./modules/ui/PageStack.mjs";

/**
 * @name TONLend - DeFi lending for FreeTON
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

async function main() {
    let pageStack = new PageStack($('#applicationContent'));

    await pageStack.loadPage('borrow');

    setTimeout(async () => {
        await pageStack.loadPage('earn');
    }, 5000)


    setTimeout(async () => {
        await pageStack.back()
    }, 10000)
}


main();