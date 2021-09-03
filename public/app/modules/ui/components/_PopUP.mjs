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

import _UIComponent from "./_UIComponent.mjs";

/**
 * Popup abstract
 * @abstract
 */
class _PopUP extends _UIComponent {
    constructor(pageId, domObject, id, page, pageScript = {methods: {}}) {
        super(pageId, domObject, id, page, pageScript);
    }

    /**
     * Initialize UI component
     * @returns {Promise<_UIComponent>}
     */
    async init() {
        return this;
    }

    /**
     * Emit event
     * @param args
     * @returns {*}
     */
    emit(...args) {
        return super.emit(...args);
    }

    /**
     * Destroy component
     * @returns {Promise<void>}
     */
    async destroy() {
        return await super.destroy();
    }

    /**
     * Run binded event method
     * @param event
     * @param params
     * @returns {Promise<*>}
     */
    async runBindedEvent(event, params = []) {
        if(this.attributes['@' + event]) {
            let method = this.attributes['@' + event].value;
            if(this.pageScript.methods[method]) {
                return await this.pageScript.methods[method](...params);
            }
        }
    }

    /**
     * Run popup
     * @param {object} params
     * @returns {Promise<*>}
     */
    async run(params = {}) {
        return false;
    }

    /**
     * Show popup
     */
    async show(params = {}) {

    }

    /**
     * Hide popup
     */
    async hide(params = {}) {

    }

}

export default _PopUP;