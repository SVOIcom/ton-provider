import ERC721 from "../modules/tonpunks/contracts/ERC721.mjs";
import utils from "../modules/utils.mjs";
import punkUtils from "../modules/tonpunks/punkUtils.mjs";


export default {
    methods: {
        page: null,
        components: {},
        punkContract: null,
        TON: null,
        CONFIG: null,
        price: 0,
        punkId: 0,
        buyPunk: async function (button, event) {
            await this.components.waitPopup.show();

            try {
                let buyPayload = await this.punkContract.buyTokenPayload(this.punkId);
                console.log('BUT PAYLOAD', buyPayload);
                let buyResult = await this.TON.walletTransfer(this.CONFIG[this.TON.network].punkAddress, this.price + 5e8, buyPayload);
                console.log('buy', buyResult, buyPayload);

                try {
                    trackData(-1, {
                        type: 'BuyPunkMarketplace',
                        punkId: this.punkId,
                        price: utils.unsignedNumberToSigned(this.price),
                        txId: buyResult.transaction.id,
                        from: (await this.TON.getWallet()).address
                    });
                } catch (e) {
                }

                await utils.wait(10000);


                await this.components.waitPopup.hide();

                //Goto my punks
                let nextPage = await this.page.pageStack.loadPage('myPunks', 'punks', {
                    punks: this.punks, ...this.runParams
                });
                await nextPage.page.popups.alert('Success!', 'Punk purchased!');

                try {
                    trackData(localStorage.refid, {
                        type: 'BuyPunk',
                        punkId: this.punkId,
                        price: utils.unsignedNumberToSigned(this.price)
                    });
                } catch (e) {
                }




            } catch (e) {
                console.log('Purchase error', e);
                await this.page.popups.error('Purchase error', 'Error occurred while creating transaction. Try again later.');
                await this.components.waitPopup.hide();
            }
        },

        async updateAvatar() {
            this.components.punkAvatarImage.src = `/punks/punkAvatar/${this.punkId}/${this.components.avatarTopText.value ? encodeURIComponent(this.components.avatarTopText.value) : ''}`;
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
            this.punkId = runParams.punkId;

            this.components.avatarFold.slideUp();

            let punkObj = punkUtils._jsonPunkToPunk(this.punks[this.punkId]);

            let punksAttributes = punkUtils.extractPunkTypesAndAttributes(this.punks);


            this.components.punkType.caption = punkObj.punkType;
            this.components.punkRank.caption = 'Rank ' + punkObj.rank;

            punkObj.badges = punkObj.badges.split(',')

            for (let key in punkObj.badges) {
                if(punksAttributes.punkAttributes[punkObj.badges[key]]) {
                    punkObj.badges[key] = `${punkObj.badges[key]} (${punksAttributes.punkAttributes[punkObj.badges[key]]})`;
                } else {
                    punkObj.badges[key] = `${punkObj.badges[key]} (secret)`;
                }
            }

            console.log(punkObj);

            this.components.punkBadges.badges = punkObj.badges.join(',');

            /**
             * @type {ERC721}
             */
            this.punkContract = await (new ERC721(this.TON, this.CONFIG)).init(this.CONFIG[this.TON.network].punkAddress);

            let tokenOwner = await this.punkContract.getOwnerOf(this.punkId);
            if(tokenOwner) {
                this.components.punkOwner.caption = `Owner <a href="${this.CONFIG[this.TON.network].explorerUrl}/accounts/accountDetails?id=${tokenOwner}" target="_blank">${utils.shortenPubkey(tokenOwner)}</a>`
            } else {
                this.components.punkOwner.caption = `Not minted`;
            }

            let sellInfo = await this.punkContract.getSellInfo(this.punkId);

            if(sellInfo.owner !== utils.EMPTY_TON_ADDRESS) {
                this.price = sellInfo.price;
                this.components.punkSellingPrice.caption = `This punk available for ${utils.unsignedNumberToSigned(sellInfo.price)} 💎`;
                try {

                    let userWallet = await this.TON.getWallet();
                    if(!userWallet.address) {
                        throw 'NoWallet';
                    }
                    if(tokenOwner !== userWallet.address) {
                        this.components.buyPunkButton.caption = `Buy this punk for ${utils.unsignedNumberToSigned(sellInfo.price)} 💎 + 0.5 💎 commission`;
                        this.components.walletState.setState('walletConnected');
                    }
                } catch (e) {
                    this.components.walletState.setState('walletNotConnected');
                }
                this.components.sellState.setState('openForBusiness');
            } else {
                this.components.walletState.setState('walletConnectedButNotForSale');
            }

        },
    }
};