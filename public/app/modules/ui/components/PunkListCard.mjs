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

class PunkListCard extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        await super.init();

        this._innerHTML = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        this.punk = this.attributes.punk.value;
        this.punkType = this.attributes.punkType.value;
        this.rank = this.attributes.rank.value;
        this.badges = this.attributes.badges.value;//.split(',');

        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();

        this.wrappedComponent = $('#' + this.id);
        this.wrappedComponent.on('click', async () => {
            await this.runBindedEvent('click', [this, this.punk]);
            this.emit('click', this);
        });

        //Disabled state check
        if(this.attributes.disabled) {
            this.disabled = true;
        }

        return this.name;
    }

    /**
     * Build HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, [ 'type', 'class']);

        return `
              <div class="col-md-12 col-lg-4" id="${this.id}" style="cursor: pointer" data-component="PunkListCard" ${attribStr}>
          <div class="box box-default pull-up">
             <fw-component type="PixelatedImage" src="/punks/punkModify/${this.punk}" alt="Punk ${this.punk}"></fw-component>
           <div class="box-body">            
                <h4 class="box-title">TonPunk #${this.punk}</h4>
                <h5>${this.punkType}</h5>
                <p class="box-text" style="font-size: 12pt;">Rank: ${this.rank}
                <br>
                <fw-component type="BadgesList" badges="${this.badges}"></fw-component>
                
                <br>
                ${this._innerHTML}
                </p>

           </div>
          </div>
        </div>`;
    }



}

export default PunkListCard;