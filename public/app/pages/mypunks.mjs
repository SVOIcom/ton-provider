import punkUtils from "../modules/tonpunks/punkUtils.mjs";
import ERC721 from "../modules/tonpunks/contracts/ERC721.mjs";
import uiUtils from "../modules/ui/uiUtils.js";
import utils from "../modules/utils.mjs";

const MAX_PAGE_PUNKS = 100000;

export default {
    methods: {
        page: null,
        components: {},
        lastIndex: 0,
        filteredPunks: [],
        filters: {types: {}, attribs: {}},
        /**
         * Click on punk
         * @param punk
         * @param punkId
         * @returns {Promise<void>}
         */
        clickPunk: async function (punk, punkId) {
            await this.page.pageStack.loadPage('showPunk/' + punkId, 'punks', {
                punkId,
                punks: this.punks, ...this.runParams
            });
        },

        /**
         * Click on transfer button
         * @param button
         * @param event
         * @returns {Promise<void>}
         */
        transferClick: async function (button, event) {
            event.stopPropagation();
            this.transferPopup = (await this.page.popups.popup('Transfer', {}, uiUtils.stackComponents(
                await this.page.constructComponent('TextInput', {
                    'name': 'transferAddress',
                    'placeholder': 'Enter address'
                }),
            ), await this.page.constructComponent('Button', {
                '@click': 'transferFinalClick',
                punkId: button.attrs.punkid
            }, 'Transfer')))
            this.transferPopup.show();
        },

        /**
         * Remove punk from sell
         * @param button
         * @param event
         * @returns {Promise<void>}
         */
        removeFromSellClick: async function (button, event) {
            event.stopPropagation();

            await this.components.waitPopup.show();

            try {
                let removeFromSellPayload = await this.punkContract.setAsNotForSalePayload(Number(button.attrs.punkid));
                let removeFromSell = await this.TON.walletTransfer(this.CONFIG[this.TON.network].punkAddress, 1e9, removeFromSellPayload)
                console.log('removeFromSell', removeFromSell, removeFromSellPayload);

                await utils.wait(10000);


                await this.components.waitPopup.hide();

                //Goto my punks
                let nextPage = await this.page.pageStack.loadPage('myPunks', 'punks', {
                    punks: this.punks, ...this.runParams
                });
                await nextPage.page.popups.alert('Success!', 'Punk removed from sell!');


            } catch (e) {
                console.log('Removing error', e);
                await this.page.popups.error('Removing error', 'Error occurred while creating transaction. Try again later.');
                await this.components.waitPopup.hide();
            }
        },

        /**
         * Sell punk click
         * @param button
         * @param event
         * @returns {Promise<void>}
         */
        sellClick: async function (button, event) {
            event.stopPropagation();
            this.sellPopup = (await this.page.popups.popup('Sell punk', {}, uiUtils.stackComponents(
                '<p>Sell price 💎</p>',
                await this.page.constructComponent('NumberSelector', {
                    'name': 'sellPrice',
                    'placeholder': 'Price',
                    min: 0,
                    max: 10000000,
                    step: 0.1,
                    value: 200.1
                }),
            ), await this.page.constructComponent('Button', {
                '@click': 'sellFinalClick',
                punkId: button.attrs.punkid
            }, 'Sell')))
            this.sellPopup.show();
        },

        /**
         * Sell punk popup click
         * @param button
         * @returns {Promise<void>}
         */
        sellFinalClick: async function (button) {
            if(this.components.sellPrice.value < 200) {
                await this.page.popups.error('Selling error', 'Minimum punk selling price is 200💎');
                return;
            }
            console.log('SELL PUNK', button.attrs.punkid, this.components.sellPrice.value);

            await this.sellPopup.hide();

            await this.components.waitPopup.show();

            try {
                let transferPayload = await this.punkContract.setForSalePayload(Number(button.attrs.punkid), utils.numberToUnsignedNumber(this.components.sellPrice.value));
                let transferResult = await this.TON.walletTransfer(this.CONFIG[this.TON.network].punkAddress, 1e9, transferPayload)
                console.log('setSellResult', transferResult, transferPayload);

                await utils.wait(10000);


                await this.components.waitPopup.hide();

                //Goto my punks
                let nextPage = await this.page.pageStack.loadPage('myPunks', 'punks', {
                    punks: this.punks, ...this.runParams
                });
                await nextPage.page.popups.alert('Success!', 'Punk now on sale!');


            } catch (e) {
                console.log('Transfer error', e);
                await this.page.popups.error('Selling error', 'Error occurred while creating transaction. Try again later.');
                await this.components.waitPopup.hide();
            }

        },

        /**
         * Transfer punk
         * @param button
         * @returns {Promise<void>}
         */
        transferFinalClick: async function (button) {
            console.log('TRANSFER PUNK', button.attrs.punkid, this.components.transferAddress.value);

            await this.transferPopup.hide();
            //await this.transferPopup.destroy();

            await this.components.waitPopup.show();

            try {
                let transferPayload = await this.punkContract.transferTokenToPayload(Number(button.attrs.punkid), this.components.transferAddress.value);
                let transferResult = await this.TON.walletTransfer(this.CONFIG[this.TON.network].punkAddress, 1e9, transferPayload)
                console.log('transferResult', transferResult, transferPayload);

                await utils.wait(10000);


                await this.components.waitPopup.hide();

                //Goto my punks
                let nextPage = await this.page.pageStack.loadPage('myPunks', 'punks', {
                    punks: this.punks, ...this.runParams
                });
                await nextPage.page.popups.alert('Success!', 'Punk transfered!');


            } catch (e) {
                console.log('Transfer error', e);
                await this.page.popups.error('Transfer error', 'Error occurred while creating transaction. Try again later.');
                await this.components.waitPopup.hide();
            }

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

            this.TON = runParams.TON;
            this.CONFIG = runParams.CONFIG;


            this.punks = [...runParams.punks];
            this.filteredPunks = this.punks;

            this.components.filtersBox.slideUp();

            await this.components.punkHolder.clear();

            try {
                this.punkContract = await (new ERC721(this.TON, this.CONFIG)).init(this.CONFIG[this.TON.network].punkAddress);

                let userWallet = await this.TON.getWallet();

                this.components.referralLink.value = `${this.CONFIG.siteAddress}/punks/referral/${encodeURIComponent(userWallet.address)}`;

                let myPunksRaw = await this.punkContract.getUserNfts(userWallet.address);

                this.components.totalPunks.caption = `Total punks: ${myPunksRaw.length}`;

                let punksSellInfoPromises = [];
                for (let punkId of myPunksRaw) {
                    punksSellInfoPromises.push(this.punkContract.getSellInfo(punkId));
                }

                let sellInfosArray = await Promise.all(punksSellInfoPromises);
                let sellInfos = {};
                for (let sellInfo of sellInfosArray) {
                    sellInfos[sellInfo.idx] = sellInfo;
                }

                console.log('SELL INFOS', sellInfos)

                this.sellInfos = sellInfos;
                this.myPunksRaw = myPunksRaw;

                this.punksForFilters = [];
                for (let punk of this.punks) {

                    if(sellInfos[punk.idx]) {
                        this.punksForFilters.push(punk);
                    }
                }


                /*let myPunks = [];
                for (let punkId of myPunksRaw) {

                    let sellButton = null;

                    let sellInfo = sellInfos[punkId]//await this.punkContract.getSellInfo(punkId);
                    // console.log(sellInfo);
                    if(sellInfo.owner === utils.EMPTY_TON_ADDRESS) {
                        sellButton = await this.page.constructComponent('Button', {
                            '@click': 'sellClick',
                            'block': true,
                            punkid: punkId,
                        }, '💰Sell (1💎 commission)');
                    } else {
                        sellButton = await this.page.constructComponent('Button', {
                            '@click': 'removeFromSellClick',
                            'block': true,
                            punkid: punkId,
                        }, 'Remove from sale (1💎 commission)')
                    }

                    myPunks.push({
                        ...punkUtils._jsonPunkToPunk(this.punks[punkId]),
                        '@click': 'clickPunk',
                        inner: uiUtils.stackComponents([
                            await this.page.constructComponent('Button', {
                                '@click': 'transferClick',
                                'block': true,
                                punkid: punkId,
                            }, 'Transfer (1💎 commission)'),
                            sellButton
                        ])
                    });
                }
                await this.components.punkHolder.addPunks(myPunks);*/

                await this.showPunksFromIndex(0);

                this.components.walletState.setState('walletConnected');

            } catch (e) {
                this.components.walletState.setState('walletNotConnected');
            }

            let typesAndAttributes = punkUtils.extractPunkTypesAndAttributes(this.punksForFilters);

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

        changeSort: async function (source, checkboxChecked) {
            console.log(source, checkboxChecked);
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

                case 'byPriceQuality':
                    this.punks.sort((a, b) => (a.ratio > b.ratio) ? 1 : -1)
                    break;
                case 'byPriceQualityDesc':
                    this.punks.sort((a, b) => (a.ratio < b.ratio) ? 1 : -1)
                    break;

                case 'byPrice':
                    this.punks.sort((a, b) => (Number(this.sellingObject[a.idx].price) > Number(this.sellingObject[b.idx].price)) ? 1 : -1)
                    break;

                case 'byPriceDesc':
                    this.punks.sort((a, b) => (Number(this.sellingObject[a.idx].price) < Number(this.sellingObject[b.idx].price)) ? 1 : -1)
                    break;
            }

            await this._applyFilter(this.filters);
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

        _getPunkById(idx, source = this.punks) {
            let map = {};

            for (let punk of source) {
                map[punk.idx] = punk;
            }
            return map[idx];
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

            /*for (let punk of localPunks) {
                i++;


                if(i > MAX_PAGE_PUNKS) {
                    break;
                }
                catalogPunks.push({
                    ...punkUtils._jsonPunkToPunk(punk),
                    '@click': 'clickPunk',
                    inner: uiUtils.stackComponents(
                        await this.page.constructComponent('Caption', {}, `Price ${utils.unsignedNumberToSigned(this.sellingObject[punk.idx].price)}💎`),
                        await this.page.constructComponent('Caption', {}, `Price quality ${(punk.ratio * 100).toFixed(0)}%`)
                    ),
                });
            }*/

            //console.log(localPunks);

            let myPunks = [];
            for (let punkId of this.myPunksRaw) {
                if(!this._getPunkById(punkId, localPunks)) {
                    continue;
                }

                //console.log(this._getPunkById(punkId, localPunks))

                let sellButton = null;

                let sellInfo = this.sellInfos[punkId]//await this.punkContract.getSellInfo(punkId);
                // console.log(sellInfo);
                if(sellInfo.owner === utils.EMPTY_TON_ADDRESS) {
                    sellButton = await this.page.constructComponent('Button', {
                        '@click': 'sellClick',
                        'block': true,
                        punkid: punkId,
                    }, '💰Sell (1💎 commission)');
                } else {
                    sellButton = await this.page.constructComponent('Button', {
                        '@click': 'removeFromSellClick',
                        'block': true,
                        punkid: punkId,
                    }, 'Remove from sale (1💎 commission)')
                }

                myPunks.push({
                    ...punkUtils._jsonPunkToPunk(this._getPunkById(punkId)),
                    '@click': 'clickPunk',
                    inner: uiUtils.stackComponents([
                        await this.page.constructComponent('Button', {
                            '@click': 'transferClick',
                            'block': true,
                            punkid: punkId,
                        }, 'Transfer (1💎 commission)'),
                        sellButton
                    ])
                });
            }
            await this.components.punkHolder.addPunks(myPunks);


            //  await this.components.punkHolder.addPunks(catalogPunks)


        },


    }
};