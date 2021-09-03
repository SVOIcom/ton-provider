/*
  ______ _____
 |  ____|  __ \
 | |__  | |__) |_ _  __ _  ___
 |  __| |  ___/ _` |/ _` |/ _ \
 | |    | |  | (_| | (_| |  __/
 |_|    |_|   \__,_|\__, |\___|
                     __/ |
                    |___/
 */
/**
 * @name FPage framework
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import Page from "./Page.mjs";
import utils from "../utils.mjs";

class PageStack extends EventEmitter3 {
    constructor(pageContentHolder, options = {}) {
        console.log('PageStack start',pageContentHolder);
        super();
        this.pageContentHolder = $(pageContentHolder);
        this.pageContentHolder.html('');
        this.options = {...options, baseZindex: 1000};
        this.stack = [];

        this.stackIndex = 0;

        window.addEventListener('popstate', async (event) => {
            if(this.stack.length !== 0) {

                if(event.state?.stackIndex) {
                    console.log(this.stackIndex, event.state.stackIndex, event);
                    //If same stack length
                    if(this.stackIndex > event.state.stackIndex) {
                        await this.back();
                    }
                }
            }
        })

    }


    /**
     * Load page and add to page stack
     * @param {string} action
     * @param {string} controller
     * @param {object} runParams
     * @returns {Promise<{controller: string, action, page: Page, pageId: string, zIndex: number}>}
     */
    async loadPage(action, controller = 'index', runParams = {}) {

        console.log('PageStack: Start load page');
        console.time('load page');

        let pageId = "page_" + utils.randomId();

        let newPage = new Page(pageId, this, {pageContainer: this.pageContentHolder});

        await newPage.load(action, controller, runParams);

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

        this.stackIndex++;
        window.history.pushState({stackIndex: this.stackIndex}, '', `/${controller}/${action}`);

        console.timeEnd('load page');

        return {...pageObj, components: pageObj.page.components};
    }

    /**
     * Going back to stack
     * @returns {Promise<void>}
     */
    async back() {
        try {
            let currentPage = this.stack.pop();

            let prevPage = this.stack[this.stack.length - 1];

            await currentPage.page.hide();
            await currentPage.page.destroy();

            this.stackIndex--;

            await prevPage.page.show();
        } catch (e) {
        }
    }

}

export default PageStack;