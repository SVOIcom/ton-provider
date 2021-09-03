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
import Popups from "./helpers/popups.mjs";

class Page extends EventEmitter3 {

    methods = {
        /**
         * Logs all incoming params
         * @param debug
         */
        debugLog: (...debug) => {
            console.log('FDebug:', ...debug);
        }
    };

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

        this.runParams = {};

        this.components = {};
        this.componentsById = {};
    }

    /**
     * Load page from backend controller
     * @param {string} action
     * @param {string} controller
     * @param {object} runParams Page start options
     * @param {boolean} hideOnLoad Hide page on load
     * @returns {Promise<Page>}
     */
    async load(action, controller = 'index', runParams = {}, hideOnLoad = true) {
        let loadedPage = await uiUtils.getPageContent(action, controller);

        this.runParams = runParams;
        this.options.pageContainer.append(`<div id="${this.id}"> ${loadedPage.html()} </div>`)
        this.page = $('#' + this.id);
        if(hideOnLoad) {
            this.page.hide();
        }
        this.pageObject = {methods: this.methods};

        //If page script defined
        let pageScript = this.page.find('[type="fpage-script"]').attr('src');
        if(pageScript) {
            try {
                let pageObject = (await import(pageScript)).default;
                if(pageObject) {
                    this.pageObject = pageObject;
                    this.methods = this.pageObject.methods;
                }
            } catch (e) {
                console.log('FError:', 'Cant load fpage-script', pageScript, 'cuz', e);
                console.error(e);
            }
        }

        await this.initializeComponents();

        //Create popups helper object
        this.popups = new Popups(this);

        //Initialize page if script method exists
        if(this.pageObject.methods.init) {
            await this.pageObject.methods.init(this, runParams);
        }

        return this;
    }

    /**
     * Initialize all fw-components
     * @param componentHolder
     * @returns {Promise<void>}
     */
    async initializeComponents(componentHolder = this.page) {
        await this.prepareUIComponents(componentHolder);
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
            //console.log('INIT COMPONENT', componentType)

            let componentClass = UIComponents[componentType];

            if(!component) {
                console.log('FPage: Parsing error: Component', componentType, 'not found');
                componentClass = UIComponents['holder'];
            }

            if(componentClass) {
                let newComponentId = componentType + '_' + utils.randomId();
                let newComponent = new componentClass(this.id, component, newComponentId, this, this.pageObject);

                let componentName = await newComponent.init();

                this.componentsById[newComponentId] = newComponent;
                this.components[componentName] = newComponent;
            }
        }

        //Repeat until all components initialized
        if(pageComponents.length !== 0) {
            await this.prepareUIComponents(pageContainer);
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

    /**
     * Construct page component code
     * @param {string} type
     * @param {object} options
     * @param {string} innerHtml
     * @returns {string}
     */
    constructComponent(type, options = {disabled: false}, innerHtml = '') {
        let componentCode = `<fw-component type="${type}"`
        for (let attribute in options) {
            componentCode += ` ${attribute}=${JSON.stringify(options[attribute])} `;
        }
        componentCode += `>${innerHtml}</fw-component>`;
        return componentCode
    }

    /**
     * Append component to end of the page (usable for popups)
     * @param {string} componentsHTML
     * @param {object} holder
     * @returns {Promise<void>}
     */
    async appendComponents(componentsHTML, holder = this.page) {
        await holder.append(componentsHTML);
        await this.initializeComponents();
    }
}

export default Page;