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

import Page from "./Page.mjs";
import utils from "../utils.mjs";

class PageStack extends EventEmitter3 {
    constructor(pageContentHolder, options = {}) {
        super();
        this.pageContentHolder = $(pageContentHolder);
        this.options = {...options, baseZindex: 1000};
        this.stack = [];
    }

    /**
     * Load page and add to page stack
     * @param action
     * @param controller
     * @returns {Promise<{controller: string, action, page: Page, pageId: string, zIndex: number}>}
     */
    async loadPage(action, controller = 'index') {
        let pageId = "page_" + utils.randomId();

        let newPage = new Page(pageId, this, {pageContainer: this.pageContentHolder});

        await newPage.load(action, controller);

        //Hide previous page
        if(this.stack.length > 0) {
            await this.stack[this.stack.length - 1].page.hide();
        }

        //Add page to stack
        let pageObj = {
            action,
            controller,
            page: newPage,
            pageId,
            zIndex: this.stack.length + 1 + this.options.baseZindex
        };
        this.stack.push(pageObj);

        //Show new page
        await newPage.show();

        return pageObj;
    }

    /**
     * Going back to stack
     * @returns {Promise<void>}
     */
    async back() {
        let currentPage = this.stack.pop();

        let prevPage = this.stack[this.stack.length - 1];

        await currentPage.page.hide();
        await currentPage.page.destroy();

        await prevPage.page.show();
    }

}

export default PageStack;