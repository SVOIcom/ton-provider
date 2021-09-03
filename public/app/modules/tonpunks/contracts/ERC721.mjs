/*_______ ____  _   _  _____
 |__   __/ __ \| \ | |/ ____|
    | | | |  | |  \| | (_____      ____ _ _ __
    | | | |  | | . ` |\___ \ \ /\ / / _` | '_ \
    | | | |__| | |\  |____) \ V  V / (_| | |_) |
    |_|  \____/|_| \_|_____/ \_/\_/ \__,_| .__/
                                         | |
                                         |_| */
/**
 * @name TONSwap project - tonswap.com
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import utils from "../../utils.mjs";

const EMPTY_ADDRESS = "0:0000000000000000000000000000000000000000000000000000000000000000";


class ERC721 {
    /**
     *
     * @param {TonWallet} ton
     * @param {object} config
     */
    constructor(ton, config) {
        this.ton = ton;
        this.config = config;
        this.contract = null;
    }


    async init(address) {
        this.contract = await this.ton.loadContract('/contracts/abi/ERC721.abi.json', address);
        return this;
    }

    /**
     * Get pair info
     * @returns {Promise<*>}
     */
    async getTokenSupplyInfo() {
        let result = (await this.contract.getTokenSupplyInfo({_answer_id: 0}));
        return {notMintedTokens: Number(result.notMintedTokens), mintedTokens: Number(result.mintedTokens)};
    }

    /**
     * Get NFT token price
     * @returns {Promise<*>}
     */
    async getTokenPrice() {
        return Number((await this.contract.getTokenPrice({_answer_id: 0})).value0);
    }


    /**
     * Get all NFTS
     * @returns {Promise<*[]>}
     */
    async getAllNfts() {
        let nftsRaw = (await this.contract.getAllNfts({_answer_id: 0})).value0;
        let nfts = [];

        for (let key in nftsRaw) {
            let nftRaw = nftsRaw[key];
            nfts[Number(key)] = {
                id: Number(nftRaw.id),
                rank: Number(nftRaw.rank),
                punkType: utils.hex2String(nftRaw.punkType),
                attributes: utils.hex2String(nftRaw.attributes).replace(/\|/g, ','),
            }
        }
        return nfts;
    }

    /**
     * Returns token owner
     * @param tokenID
     * @returns {Promise<*>}
     */
    async getOwnerOf(tokenID) {
        let owner = (await this.contract.getOwnerOf({_answer_id: 0, tokenID})).value0;
        return owner === EMPTY_ADDRESS ? false : owner;
    }

    /**
     * Returns user nfts
     * @param collector
     * @returns {Promise<*[]>}
     */
    async getUserNfts(collector) {
        let rawTokensInfo = (await this.contract.getUserNfts({_answer_id: 0, collector})).value0;
        let tokens = [];
        for (let key in rawTokensInfo) {
            if(rawTokensInfo[key]) {
                tokens.push(Number(key))
            }
        }
        return tokens;
    }

    /**
     * Create mintToken payload
     * @param referal
     * @returns {Promise<*>}
     */
    async mintTokenPayload(referal) {
        return await this.contract.mintToken.payload({referal});
    }

    /**
     * Create transfer payload
     * @param tokenID
     * @param receiver
     * @returns {Promise<*>}
     */
    async transferTokenToPayload(tokenID, receiver) {
        return await this.contract.transferTokenTo.payload({tokenID, receiver});
    }

    async setForSalePayload(tokenID, tokenPrice) {
        return await this.contract.setForSale.payload({tokenID, tokenPrice});
    }

    async setAsNotForSalePayload(tokenID) {
        return await this.contract.setAsNotForSale.payload({tokenID});
    }

    async buyTokenPayload(tokenID) {
        return await this.contract.buyToken.payload({tokenID});
    }


    /**
     * Get token sell info
     * @param tokenID
     * @returns {Promise<*>}
     */
    async getSellInfo(tokenID) {
        let sellInfo = (await this.contract.getSellInfo({_answer_id: 0, tokenID})).value0;
        sellInfo.price = Number(sellInfo.price);
        sellInfo.idx = tokenID;
        return sellInfo;
    }

    /**
     *
     * @returns {Promise<*>}
     */
    async getAllTokensForSale() {
        let rawTokensInfo = (await this.contract.getAllTokensForSale({_answer_id: 0})).value0
        let tokens = [];
        for (let key in rawTokensInfo) {
            if(rawTokensInfo[key]) {
                tokens.push({idx:Number(key), owner: rawTokensInfo[key].owner, price: Number(rawTokensInfo[key].price)})
            }
        }
        return tokens;
    }

}


export default ERC721;