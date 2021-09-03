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

class PixelatedImage extends _UIComponent {


    /**
     * Initialize
     * @returns {Promise<void>}
     */
    async init() {

        let attributes = this.domObject[0].attributes;

        this.name = attributes.name ? attributes.name.value : this.id;

        this._disabled = !!attributes.disabled;

        let attribStr = this.attributesObjectToStr(this.attrs, ['type', 'class']);

        //Construct button HTML
        this.domObject[0].outerHTML = (`<img id="${this.id}" class="card-img-top img-responsive" src="${attributes.src.value}" alt="${attributes.alt.value}" style="image-rendering: -moz-crisp-edges; image-rendering: pixelated; background: rgb(255,206,70); background: linear-gradient(0deg, rgba(255,206,70,1) 0%, rgba(255,236,178,1) 100%); ${this.attrs.style ? this.attrs.style : ''}" ${attribStr}>`)
        this.wrappedComponent = $('#' + this.id);
        this.wrappedComponent.on('click', async () => {
            await this.runBindedEvent('click', [this]);
            this.emit('click', this);
        })

        return this.name;
    }

    get src() {
        return this.wrappedComponent.attr('src');
    }

    set src(src) {
        this.wrappedComponent.attr('src', src);
    }

}

export default PixelatedImage;