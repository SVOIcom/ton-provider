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

import Slider from "./Slider.mjs";
import uiUtils from "../uiUtils.js";

class NumberSelector extends Slider {

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['style', 'type']);

        return `
            <input id="${this.id}" style="width: 100%; ${this.attrs.style?this.attrs.style:''}" type="number" min="${this.attrs.min ? this.attrs.min : 0}" max="${this.attrs.max ? this.attrs.max : 10000}" value="${this.attrs.value ? this.attrs.value : 0}" step="${this.attrs.step ? this.attrs.step : 1}" ${attribStr}>`;
    }


}

export default NumberSelector;