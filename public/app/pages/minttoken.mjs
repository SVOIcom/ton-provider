const DEFAULT_REFERRAL = '0:c1f2b2941fe3ed16960c484db49186363ed4bbb7c825a8128f46d787f973ff2b';

import punkUtils from "../modules/tonpunks/punkUtils.mjs";
import ERC721 from "../modules/tonpunks/contracts/ERC721.mjs";
import utils from "../modules/utils.mjs";
import Popups from "../modules/ui/helpers/popups.mjs";

export default {
    methods: {
        page: null,
        components: {},
        lastIndex: 0,
        filteredPunks: [],
        tokenPrice: 0,
        /**
         * @var {ERC721}
         */
        punkContract: null,
        test: async function (...a) {
            console.log(...a);
        },

        /**
         * Update mint button state
         * @param element
         * @param count
         * @returns {Promise<void>}
         */
        updateMintButton: async function (element, count) {
            if(!count) {
                count = 1;
            }


            this.components.countSelector.value = count;
            this.components.countSlider.value = count;
            this.components.mintTokenButton.caption = `Mint ${count} ${count < 2 ? 'punk' : 'punks'} for ${utils.unsignedNumberToSigned(this.tokenPrice * count)}💎 ${localStorage.referral ? ' with referral' : ''} + 0.5💎 commission`;
        },

        /**
         * Start mint token
         * @returns {Promise<void>}
         */
        mintToken: async function () {

            await this.components.waitPopup.show();

            let mintPayload = await this.punkContract.mintTokenPayload(localStorage.referral ? localStorage.referral : DEFAULT_REFERRAL);

            console.log('mint payload', mintPayload);
            try {
                let mintResult = await this.TON.walletTransfer(this.CONFIG[this.TON.network].punkAddress, (await this.punkContract.getTokenPrice() * this.components.countSelector.value) + 5e8, mintPayload)
                console.log('Mintresult', mintResult);

                await utils.wait(10000);


                await this.components.waitPopup.hide();

                //Goto my punks
                let nextPage = await this.page.pageStack.loadPage('myPunks', 'punks', {
                    punks: this.punks, ...this.runParams
                });
                await nextPage.page.popups.alert('Success!', 'Your punks are minted!');

                try {
                    trackData(localStorage.refid, {
                        type:'MintPunk',
                        count: this.components.countSelector.value,
                        referral: localStorage.referral
                    });
                }catch (e) {
                }

            } catch (e) {
                console.log('Mint error', e);
                await this.page.popups.error('Minting error', 'Error happens when minting running. Try again later.');
            }

            await this.components.waitPopup.hide();
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

            this.punks = runParams.punks;
            this.filteredPunks = this.punks;

            window.testPage = this.page;

            this.punkContract = await (new ERC721(this.TON, this.CONFIG)).init(this.CONFIG[this.TON.network].punkAddress);

            try {
                let punksSupply = await this.punkContract.getTokenSupplyInfo();
                this.components.punksMinted.caption = `Available ${punksSupply.notMintedTokens} punks of ${punksSupply.mintedTokens + punksSupply.notMintedTokens}`
                this.components.punksMintedBar.max = punksSupply.mintedTokens + punksSupply.notMintedTokens;
                this.components.punksMintedBar.value = punksSupply.notMintedTokens;

                if(punksSupply.notMintedTokens < 50) {
                    this.components.countSelector.max = punksSupply.notMintedTokens;
                    this.components.countSlider.max = punksSupply.notMintedTokens;
                }
            } catch (e) {

            }

            try {


                let userWallet = await this.TON.getWallet();

                if(!userWallet.address) {
                    throw 'WalletNotCOnnected';
                }

                if(localStorage.referral === userWallet.address) {
                    delete localStorage.referral;
                }

                this.tokenPrice = await this.punkContract.getTokenPrice();

                await this.updateMintButton();

                this.components.walletState.setState('walletConnected');

            } catch (e) {
                console.log('Wallet not connected')
                this.components.walletState.setState('walletNotConnected');
            }

            if(testPage.components.punksMintedBar.value === 0){
                this.components.walletState.setState('outOfStock');
            }

        },

    }
};