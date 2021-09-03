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

class Checkbox extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {

        this._caption = this.domObject.html();

        let attributes = this.domObject[0].attributes;

        this.name = attributes.name ? attributes.name.value : this.id;

        this._disabled = !!attributes.disabled;
        this._placeholder = attributes.placeholder ? attributes.placeholder.value : '';

        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();

        this.wrappedComponent = $('#' + this.id);

        let internalCheckbox = this.wrappedComponent.find('[type="checkbox"]');

        internalCheckbox.on('click', async (event) => {
            //Run @click methods
            await this.runBindedEvent('click', [this, this.checked, event]);
            this.emit('click', this, this.checked, event);
        })
        internalCheckbox.on('change', async (event) => {
            //Run @click methods
            await this.runBindedEvent('change', [this, this.checked, event]);
            this.emit('change', this, this.checked, event);
        })

        return this.name;
    }

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, [ 'type', 'class']);

        return `   
                        <div class="checkbox" id="${this.id}" ${attribStr}>
                            <input type="checkbox" id="${this.id}_checkbox">
                            <label for="${this.id}_checkbox">${this._caption}</label>
                        </div>`;
    }

    /**
     * Get value
     * @returns {*}
     */
    get checked() {
        return this.wrappedComponent.find('[type="checkbox"]').prop('checked');
    }

    /**
     * Set value
     * @param value
     */
    set checked(value) {
        this.wrappedComponent.find('[type="checkbox"]').prop('checked', value)
    }

}

export default Checkbox;