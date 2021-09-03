import punkUtils from "../modules/tonpunks/punkUtils.mjs";

const MAX_PAGE_PUNKS = 9;

export default {
    methods: {
        page: null,
        components: {},
        lastIndex: 0,
        filteredPunks: [],
        filters: {types: {}, attribs: {}},

        test: async (...a) => {
            console.log(...a);
        },
        clickPunk: async function (punk, punkId) {
            console.log('Punk clicked', punk);
            /*await this.components.punkHolder.addPunk({
                punk: 44,
                punkType: 'Test',
                rank: 1111,
                badges: '123,321',
                '@click': 'clickPunk'
            });*/

            await this.page.pageStack.loadPage('showPunk/' + punkId, 'punks', {
                punkId,
                punks: this.punks, ...this.runParams
            });
        },

        changeSort: async function (source, checkboxChecked) {
            this.components.byId.checked = false;
            this.components.byRating.checked = false;

            this.components[source.name].checked = true;

            switch (source.name) {
                case 'byId':
                    this.punks.sort((a, b) => (a.idx > b.idx) ? 1 : -1)
                    break;

                case 'byRating':
                    this.punks.sort((a, b) => (a.rank > b.rank) ? 1 : -1)
                    break;
            }

            await this._applyFilter(this.filters);
        },

        /**
         * Show more button
         * @returns {Promise<void>}
         */
        showMore: async function () {
            this.components.showMoreButton.disabled = true;

            await this.showPunksFromIndex(this.lastIndex);

            this.lastIndex += MAX_PAGE_PUNKS;

            this.components.showMoreButton.disabled = false;
        },

        /**
         * Page intialize
         * @param page
         * @param runParams
         * @returns {Promise<void>}
         */
        init: async function (page, runParams) {
            this.page = page;
            this.components = page.components;
            this.runParams = runParams;

            this.punks =  [...runParams.punks];
            this.filteredPunks = this.punks;

            this.components.byId.checked = true;
            this.components.filtersBox.slideUp();

            await this.components.punkHolder.clear();

            await this.showPunksFromIndex(0);
            this.lastIndex = MAX_PAGE_PUNKS;


            let typesAndAttributes = punkUtils.extractPunkTypesAndAttributes(this.punks);

            for (let type in typesAndAttributes.punkTypes) {
                await this.components.typesCheckboxesHolder.appendComponents(await this.page.constructComponent('Checkbox', {
                    '@click': 'updateFilters',
                    punktype: type,
                }, type + ` (${typesAndAttributes.punkTypes[type]})`))
            }

            for (let attrib in typesAndAttributes.punkAttributes) {
                await this.components.attributesCheckboxesHolder.appendComponents(await this.page.constructComponent('Checkbox', {
                    '@click': 'updateFilters',
                    punkattrib: attrib,
                }, attrib + ` (${typesAndAttributes.punkAttributes[attrib]})`))
            }


        },

        updateFilters: async function (source, checkboxChecked) {
            //let hasFilters = false;
            //this.filters = {types:{}, attribs:{}};
            if(this.components.idInput.value !== '') {
                // hasFilters = true;
                this.filters.idx = this.components.idInput.value;
            } else {
                delete this.filters.idx;
            }

            if(source.attrs && source.attrs.punktype) {
                if(checkboxChecked) {
                    //  hasFilters = true;
                    this.filters.types[source.attrs.punktype] = source.attrs.punktype;
                } else {
                    delete this.filters.types[source.attrs.punktype];
                }
            }

            if(source.attrs && source.attrs.punkattrib) {
                if(checkboxChecked) {
                    // hasFilters = true;
                    this.filters.attribs[source.attrs.punkattrib] = source.attrs.punkattrib;
                } else {
                    delete this.filters.attribs[source.attrs.punkattrib];
                }
            }

            if(source.name === 'noAttribs') {
                if(checkboxChecked) {
                    this.filters.attribs['noAttrib'] = 'noAttrib';
                } else {
                    delete this.filters.attribs['noAttrib'];
                }
            }

            await this._applyFilter(this.filters);
            /*if(hasFilters) {
                await this._applyFilter(this.filters);
            } else {
                await this._applyFilter();
            }*/
        },

        _applyFilter: async function (filters = null) {
            let resultArray = [];

            console.log('APPLYED FILTERS', filters);

            if(filters) {


                for (let punk of this.punks) {

                    let acceptedByIdFilter = false;
                    let acceptedByTypesFilter = false;
                    let acceptedByAttribsFilter = false;

                    if(filters.idx) {
                        if(String(punk.idx).includes(filters.idx)) {
                            acceptedByIdFilter = true;
                        }
                    } else {
                        acceptedByIdFilter = true;
                    }

                    if(Object.keys(this.filters.types).length === 0) {
                        acceptedByTypesFilter = true;
                    } else if(Object.keys(this.filters.types).includes(punk.type)) {
                        acceptedByTypesFilter = true;
                    }

                    let pushThatPunk = false;
                    for (let punkAttrib of punk.attributes) {
                        if(Object.keys(this.filters.attribs).includes(punkAttrib)) {
                            pushThatPunk = true;
                        }
                    }

                    if(this.filters.attribs['noAttrib'] && punk.attributes.length === 0){
                        pushThatPunk = true;
                    }

                    if(pushThatPunk || Object.keys(this.filters.attribs).length === 0) {
                        acceptedByAttribsFilter = true;
                    }

                    if(acceptedByTypesFilter && acceptedByAttribsFilter && acceptedByIdFilter) {
                        resultArray.push(punk);
                    }

                }
            } else {
                resultArray = this.punks;
            }

            this.filteredPunks = resultArray;
            await this.components.punkHolder.clear();
            await this.showPunksFromIndex(0);
            this.lastIndex = MAX_PAGE_PUNKS;
        },

        /**
         * Reset punks view
         * @returns {Promise<void>}
         */
        reset: async function () {
            this.filteredPunks = this.punks;
            await this.components.punkHolder.clear();
            await this.showPunksFromIndex(0);
            this.lastIndex = MAX_PAGE_PUNKS;
        },

        /**
         * Add punks in catalog from index
         * @param index
         * @returns {Promise<void>}
         */
        showPunksFromIndex: async function (index) {
            let localPunks = index === 0 ? this.filteredPunks : this.filteredPunks.slice(index);
            let i = 0;
            let catalogPunks = [];

            for (let punk of localPunks) {
                i++;
                if(i > MAX_PAGE_PUNKS) {
                    break;
                }
                catalogPunks.push({...punkUtils._jsonPunkToPunk(punk), '@click': 'clickPunk'});
            }
            console.log('LOCAL', catalogPunks, this.lastIndex);
            await this.components.punkHolder.addPunks(catalogPunks)


        },



    }
};