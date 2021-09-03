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

class TextInput extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        console.log('Init text input', this.domObject, this.pageId);


        this._caption = this.domObject.html();

        let attributes = this.domObject[0].attributes;

        this.name = attributes.name ? attributes.name.value : this.id;

        this._disabled = !!attributes.disabled;
        this._placeholder = attributes.placeholder ? attributes.placeholder.value : '';

        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();

        this.wrappedComponent = $('#' + this.id);

        this.wrappedComponent.on('click', async () => {
            //Run @click methods
            await this.runBindedEvent('click', [this]);
            this.emit('click', this);
        })
        this.wrappedComponent.on('change', async () => {
            //Run @click methods
            await this.runBindedEvent('change', [this, this.wrappedComponent.val()]);
            this.emit('change', this, this.wrappedComponent.val());
        })
        this.wrappedComponent.on('keyup', async () => {
            //Run @click methods
            await this.runBindedEvent('keyup', [this, this.wrappedComponent.val()]);
            this.emit('keyup', this, this.wrappedComponent.val());
        })
        this.wrappedComponent.on('keyup', async () => {
            //Run @click methods
            await this.runBindedEvent('keydown', [this, this.wrappedComponent.val()]);
            this.emit('keyup', this, this.wrappedComponent.val());
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

        return `<input id="${this.id}" type="text" class="form-control" placeholder="${this._placeholder}" ${attribStr}>`;
    }

    /**
     * Get value
     * @returns {*}
     */
    get value() {
        return this.wrappedComponent.val();
    }

    /**
     * Set value
     * @param value
     */
    set value(value) {
        this.wrappedComponent.val(value)
    }

}

export default TextInput;