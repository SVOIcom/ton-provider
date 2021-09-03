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
import uiUtils from "../uiUtils.js";
import Holder from "./Holder.mjs";

class CaptionedBox extends Holder {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {


        let internalObjects = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;


        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml(internalObjects);
        console.log(this.domObject);
        this.wrappedComponent = $('#' + this.id);

        //Disabled state check
        if(this.attributes.disabled) {
            this.disabled = true;
        }

        return this.name;
    }

    /**
     * Build HTML
     * @param internalObjects
     * @returns {Promise<string>}
     */
    async buildHtml(internalObjects) {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['type', 'class']);

        return `
              <div class="box" id="${this.id}" ${attribStr}>
                <div class="box-header with-border">
                    <h3 class="box-title">${this.attributes.caption ? this.attributes.caption.value : ''}</h3>
                </div>
                <div class="box-body">
                    ${internalObjects}
                </div>
            </div>`;
    }


    /**
     * Append components to box
     * @param componentsHTML
     * @returns {Promise<void>}
     */
    async appendComponents(componentsHTML) {
        this.wrappedComponent.find('.box-body').append(componentsHTML);
        await this.page.initializeComponents();
    }

    /**
     * Clear box content
     * @returns {Promise<void>}
     */
    async clearContent() {
        this.wrappedComponent.find('.box-body').html('');
    }

}

export default CaptionedBox;