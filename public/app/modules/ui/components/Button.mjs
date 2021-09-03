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

class Button extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        //console.log('Init button', this.domObject, this.pageId);


        this._caption = this.domObject.html();

        // let attributes = this.domObject[0].attributes;

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        this._disabled = !!this.attributes.disabled;


        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();

        //Save constructed element DOM
        this.wrappedComponent = $('#' + this.id);

        //Setup actions
        this.wrappedComponent.on('click', async (event) => {
            //Run @click methods
            await this.runBindedEvent('click', [this, event]);
            this.emit('click', this, event);
        })

        return this.name;
    }

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['disabled', 'href', 'type', 'class']);

        return `
            <button id="${this.id}" class="btn  ${this.attributes.flat ? 'btn-flat' : 'btn-default'} ${this.attributes.right ? 'float-right' : ''} ${this.attributes.large ? 'btn-lg' : ''} ${this._disabled ? 'disabled' : ''} ${this.attributes.block ? 'btn-block' : ''}  "   ${this.attributes.href ? 'href="' + this.attributes.href.value + '"' : ''} ${attribStr}>
                ${this._caption}
            </button>`;
    }

    /**
     * Get btn caption
     * @returns {*}
     */
    get caption() {
        return this._caption;
    }

    /**
     * Set BTN caption
     * @param html
     */
    set caption(html) {
        this._caption = html;
        $(`#${this.id}`).html(html);
    }

    /**
     * Get state
     * @returns {*|boolean}
     */
    get disabled() {
        return this._disabled;
    }

    /**
     * Set state
     * @param boolVal
     */
    set disabled(boolVal) {
        this._disabled = boolVal;
        if(boolVal) {
            $(`#${this.id}`).addClass('disabled');
        } else {
            $(`#${this.id}`).removeClass('disabled');
        }
    }


}

export default Button;