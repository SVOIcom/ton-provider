import punkUtils from "../modules/tonpunks/punkUtils.mjs";
import ERC721 from "../modules/tonpunks/contracts/ERC721.mjs";
import uiUtils from "../modules/ui/uiUtils.js";
import utils from "../modules/utils.mjs";

export default {
    methods: {
        page: null,
        components: {},




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


            try {
                this.punkContract = await (new ERC721(this.TON, this.CONFIG)).init(this.CONFIG[this.TON.network].punkAddress);

                let userWallet = await this.TON.getWallet();

                if(!userWallet.address){
                    throw 'NoWallet';
                }

                this.components.referralLink.value = `${this.CONFIG.siteAddress}/punks/referral/${encodeURIComponent(userWallet.address)}${localStorage.refid?'?refid='+localStorage.refid:''}`;

                this.components.walletState.setState('walletConnected');

            } catch (e) {
                console.log(e);
                this.components.walletState.setState('walletNotConnected');
            }

        },

    }
};