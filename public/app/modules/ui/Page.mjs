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

import uiUtils from "./uiUtils.js";
import utils from "../utils.mjs";
import UIComponents from "./components/UIComponents.mjs";

class Page extends EventEmitter3 {
    /**
     *
     * @param {string|number} id
     * @param {PageStack} pageStack
     * @param {{}} options
     */
    constructor(id = "page_" + utils.randomId(), pageStack = null, options = {}) {
        super();
        this.id = id;
        this.pageStack = pageStack;
        this.page = null;
        this.options = {
            ...options,
            pageContainer: $('#applicationContent')
        };

        this.components = {};
        this.componentsById = {};
    }

    /**
     * Load page from backend controller
     * @param action
     * @param controller
     * @returns {Promise<Page>}
     */
    async load(action, controller = 'index') {
        let loadedPage = await uiUtils.getPageContent(action, controller);
        this.options.pageContainer.append(`<div id="${this.id}"> ${loadedPage.html()} </div>`)
        this.page = $('#' + this.id);
        await this.prepareUIComponents(this.page);
        return this;
    }

    /**
     * Find and initialize page UI components
     * @param pageContainer
     * @returns {Promise<void>}
     */
    async prepareUIComponents(pageContainer) {
        let pageComponents = $(pageContainer).find('fw-component');

        for (let component of pageComponents) {
            component = $(component);

            let componentType = component.attr('type').toLowerCase();
            if(UIComponents[componentType]) {
                let newComponentId = componentType + '_' + utils.randomId();
                let newComponent = new UIComponents[componentType](this.id, component, newComponentId);

                let componentName = await newComponent.init();

                this.componentsById[newComponentId] = newComponent;
                this.components[componentName] = newComponent;
            }
        }
    }

    /**
     * Hide page
     * @returns {Promise<void>}
     */
    async hide() {
        if(this.page) {
            this.page.hide();
        }
    }

    /**
     * Show page
     * @returns {Promise<void>}
     */
    async show() {
        if(this.page) {
            this.page.show();
        }
    }

    /**
     * Destroy page
     * @returns {Promise<void>}
     */
    async destroy() {
        if(this.page) {
            this.page.remove();
        }
    }
}

export default Page;