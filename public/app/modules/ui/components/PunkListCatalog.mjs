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

class PunkListCatalog extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        await super.init();
        this.punks = [];

        let definedPunks = this.domObject.find('fw-component[type="PunkListCard"]');

        for (let punk of definedPunks) {
            this.punks.push({...uiUtils.attributesToObject(punk.attributes)})
        }

        let attributes = this.attributes;
        this.name = attributes.name ? attributes.name.value : this.id;


        //Construct button HTML
        this.domObject[0].outerHTML = (` 
             <div class="row" style="padding-bottom: 30px;" id="${this.id}">
                <div class="showIfEmpty" style="text-align: center;width: 100%;font-size: 18pt;">No punks to show</div>
             </div>
      
        `);

        //Disabled state check
        if(this.attributes.disabled) {
            this.disabled = true;
        }

        if(this.punks.length !== 0) {
            $(`#${this.id}`).find('.showIfEmpty').hide();
            await this._addPunks(this.punks, true);
        }

        return this.name;
    }

    /**
     * Add punks to view
     * @param optionsArr
     * @param ignoreInit
     * @returns {Promise<void>}
     * @private
     */
    async _addPunks(optionsArr = [], ignoreInit = false) {
        if(optionsArr.length !== 0) {
            $(`#${this.id}`).find('.showIfEmpty').hide();
            for (let punk of optionsArr) {
                let punkInner = punk.inner ? punk.inner : '';
                punk.inner = '';
                let punkComponent = this.page.constructComponent('PunkListCard', punk, punkInner);
                $(`#${this.id}`).append(punkComponent);
            }

            if(!ignoreInit) {
                await this.page.initializeComponents();
            }
        } else {
            if(this.punks.length === 0) {
                $(`#${this.id}`).find('.showIfEmpty').show();
            }
        }
    }

    /**
     * Add new punk
     * @param options
     * @returns {Promise<void>}
     */
    async addPunk(options) {
        await this._addPunks([options]);
        this.punks.push(options);
    }

    /**
     * Add any punks
     * @param optionsArr
     * @returns {Promise<void>}
     */
    async addPunks(optionsArr) {
        await this._addPunks(optionsArr);

        this.punks = [...this.punks, ...optionsArr];
    }

    /**
     * Clear punks list
     * @returns {Promise<void>}
     */
    async clear() {
        $(`#${this.id}`).find('[data-component="PunkListCard"]').remove();
        this.punks = [];
        $(`#${this.id}`).find('.showIfEmpty').show();

    }


}

export default PunkListCatalog;