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

class ProgressBar extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {

        this._max = this.attrs.max ?? 100;
        this._min = this.attrs.min ?? 0;
        this._value = this.attrs.value ?? 0;
        this._percentage = 0;

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        this._disabled = !!this.attributes.disabled;


        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();

        //Save constructed element DOM
        this.wrappedComponent = $('#' + this.id);

        await this.update();


        return this.name;
    }

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['type', 'style']);

        return `
              <div class="progress" id="${this.id}" ${attribStr}>
                ${await this.buildProgressPart()}
              </div>
                `;
    }

    async buildProgressPart() {
        return `<div class="progress-bar progress-bar-yellow" role="progressbar"  style="width: ${this._percentage}%">
                  <span class="sr-only"></span>
                </div>`;
    }

    async update() {
        this._percentage = ((this._value / (this._max - this._min)) * 100);
        this.wrappedComponent.html(await this.buildProgressPart());
    }


    /**
     * Redefine value
     * @returns {*}
     */
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.update();
    }

    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value;
        this.update();
    }


    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value;
        this.update();
    }


}

export default ProgressBar;