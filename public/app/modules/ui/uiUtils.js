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
    },

    /**
     * Converts attributes to mapped object
     * @param attributes
     * @returns {{}}
     */
    attributesToObject(attributes) {
        //console.log('AA', attributes);
        let object = {};
        for (let attribute of Array.from(attributes)) {
            //console.log(attribute, attributes[attribute])
            object[attribute.name] = attribute.value;
        }
        return object;
    },

    /**
     * Stack components together
     * @param components
     * @returns {string}
     */
    stackComponents(...components) {

        if(components.length === 1 && Array.isArray(components[0])) {
            return Array.from(components[0]).join(' ');
        }

        return Array.from(components).join(' ');
    },
    /**
     * Copy text to clipboard
     * @param text
     * @returns {Promise<void>}
     */
    copyToClipboard: async (text) => {
        await navigator.clipboard.writeText(text);
    },
}

export default uiUtils;