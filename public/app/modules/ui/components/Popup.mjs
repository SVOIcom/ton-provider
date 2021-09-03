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


import _PopUP from "./_PopUP.mjs";

class Popup extends _PopUP {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        this._innerHTML = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        let content = this.domObject.find('content');
        if(content.length !== 0) {
            this._innerHTML = content.html();
        }

        let footerHtml = '';
        let footer = this.domObject.find('footer');
        if(footer.length !== 0) {
            footerHtml = footer.html();
        }

        //Construct button HTML
        this.domObject[0].outerHTML = (`
            <div class="modal fade" ${this.attributes.static ? 'data-backdrop="static" data-keyboard="false"' : ''}  id="${this.id}">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title modalCaption" >Modal caption</h4>
                            ${this.attributes.unclosable ? '' : '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'}
                        </div>
                        <div class="modal-body">
                            ${this._innerHTML}
                        </div>
                        <div class="modal-footer">
                           ${footerHtml}
                        </div>
                    </div>
                </div>
            </div>
             `)
        this.wrappedComponent = $('#' + this.id);

        this.wrappedComponent.on('hidden.bs.modal', async () => {
            await this.runBindedEvent('close', [this]);
            this.emit('close', this);
        })


        this.caption = this.attributes.caption ? this.attributes.caption.value : '';


        return this.name;
    }

    /**
     * Get popup caption
     */
    get caption() {
        this.wrappedComponent.find('.modalCaption').html();
    }

    /**
     * Set popup caption
     * @param caption
     */
    set caption(caption) {
        this.wrappedComponent.find('.modalCaption').html(caption);
    }

    /**
     * Show popup
     * @returns {Promise<void>}
     */
    async show() {
        this.wrappedComponent.modal('show');
    }

    /**
     * Hide popup
     * @returns {Promise<void>}
     */
    async hide() {
        this.wrappedComponent.modal('hide');
    }


}

export default Popup;