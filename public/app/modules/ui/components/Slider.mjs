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

class Slider extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        //console.log('Init button', this.domObject, this.pageId);


        // let attributes = this.domObject[0].attributes;

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        this._disabled = !!this.attributes.disabled;


        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();

        //Save constructed element DOM
        this.wrappedComponent = $('#' + this.id);

        //Setup actions
        this.wrappedComponent.on('click', async () => {
            await this.runBindedEvent('click', [this, this.value]);
            this.emit('click', this, this.value);
        });
        this.wrappedComponent.on('change', async () => {
            await this.runBindedEvent('change', [this, this.value]);
            this.emit('change', this, this.value);
        });
        this.wrappedComponent.on('input', async () => {
            await this.runBindedEvent('slide', [this, this.value]);
            this.emit('slide', this, this.value);
        });

        //this.setupValueGettersSetters();
        this.setupAttributeGettersSetters('min');
        this.setupAttributeGettersSetters('max');
        this.setupAttributeGettersSetters('step');

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
            <input id="${this.id}" style="width: 100%;  ${this.attrs.style ? this.attrs.style : ''}" type="range" min="${this.attrs.min ? this.attrs.min : 0}" max="${this.attrs.max ? this.attrs.max : 10000}" value="${this.attrs.value ? this.attrs.value : 0}" step="${this.attrs.step ? this.attrs.step : 1}" ${attribStr}>`;
    }


    /**
     * Redefine value
     * @returns {*}
     */
    get value() {
        let count = Number(this.wrappedComponent.val());
        if(count < this.min) {
            this.value = this.min;
            return this.min;
        }
        if(count > this.max) {
            this.value = this.max;
            return this.max;
        }
        return count;
    }

    set value(value) {
        this.wrappedComponent.val(value);
    }


}

export default Slider;