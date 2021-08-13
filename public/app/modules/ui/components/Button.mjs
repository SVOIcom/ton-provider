/*
  _______ ____  _   _ _                    _
 |__   __/ __ \| \ | | |                  | |
    | | | |  | |  \| | |     ___ _ __   __| |
    | | | |  | | . ` | |    / _ \ '_ \ / _` |
    | | | |__| | |\  | |___|  __/ | | | (_| |
    |_|  \____/|_| \_|______\___|_| |_|\__,_|
 */
/**
 * @name TONLend - DeFi lending for FreeTON
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import _UIComponent from "./_UIComponent.mjs";

class Button extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        console.log('Init button', this.domObject, this.pageId);


        this._caption = this.domObject.html();

        let attributes = this.domObject[0].attributes;

        this.name = attributes.name ? attributes.name.value : this.id;

        this._disabled = !!attributes.disabled;

        //window.testButton = this;

        console.log(this.domObject);
        //Construct button HTML
        this.domObject[0].outerHTML = (`
        <a id="${this.id}" class="btn  ${attributes.flat ? 'btn-flat' : 'btn-default'} ${attributes.large ? 'btn-lg' : ''} ${this._disabled ? 'disabled' : ''} btn-block " style="${attributes.style ? attributes.style.value : ''}"  ${attributes.href ? 'href="' + attributes.href.value + '"' : ''}>
            ${this._caption}
            </a> `)

        $(this.domObject).on('click', () => {
            this.emit('click', this);
        })

        return this.name;
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