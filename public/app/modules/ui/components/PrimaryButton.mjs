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

import Button from "./Button.mjs";

class PrimaryButton extends Button {

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['disabled', 'href', 'type', 'class']);
        return `
            <button id="${this.id}" class="btn  btn-primary ${this.attributes.flat ? 'btn-flat' : 'btn-default'} ${this.attributes.right ? 'float-right' : ''} ${this.attributes.large ? 'btn-lg' : ''} ${this._disabled ? 'disabled' : ''} ${this.attributes.block ? 'btn-block' : ''}  "   ${this.attributes.href ? 'href="' + this.attributes.href.value + '"' : ''} ${attribStr}>
                ${this._caption}
            </button>`;
    }

}

export default PrimaryButton;