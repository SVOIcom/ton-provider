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
 */
const {TonClientWrapper} = require('../../tonDataCollector/modules/tonclient-wrapper');
const networkAddress = require('../../tonDataCollector/config/network')('mainnet');
const {abiContract} = require("@tonclient/core");

class TokenDataResolver {
    async init(address) {
        this.ton = (new TonClientWrapper({
            network: networkAddress,
            message_expiration_timeout: 30000
        })).ton;
        this.address = address;
        this.abiContract = abiContract(require('../../tonDataCollector/abi/RootTokenContract.json'));

        return this;
    }

    async runLocal(functionName, input = {}) {
        const account = (await this.ton.net.query_collection({
            collection: 'accounts',
            filter: {id: {eq: this.address}},
            result: 'boc'
        })).result[0].boc;

        const message = await this.ton.abi.encode_message({
            abi: this.abiContract,
            address: this.address,
            call_set: {
                function_name: functionName,
                input: input
            },
            signer: {
                type: 'None',
            }
        });

        let response = await this.ton.tvm.run_tvm({
            message: message.message,
            account: account,
            abi: this.abiContract
        });

        return response.decoded.output;
    }

    async getTokenDetails() {
        return (await this.runLocal('getDetails', {_answer_id: 0})).value0;
    }
}

module.exports = TokenDataResolver;