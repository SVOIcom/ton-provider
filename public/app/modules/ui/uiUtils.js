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

const uiUtils = {
    /**
     * Load page content DOM
     * @param action
     * @param controller
     * @returns {Promise<*|jQuery>}
     */
    async getPageContent(action, controller = 'index') {
        let result = await $.get(`/${controller}/${action}`);
        return $(result).find('#applicationContent')
    }
}

export default uiUtils;