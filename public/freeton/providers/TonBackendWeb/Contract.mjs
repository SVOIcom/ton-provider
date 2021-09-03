/*
  _______          _____                _     _
 |__   __|        |  __ \              (_)   | |
    | | ___  _ __ | |__) | __ _____   ___  __| | ___ _ __
    | |/ _ \| '_ \|  ___/ '__/ _ \ \ / / |/ _` |/ _ \ '__|
    | | (_) | | | | |   | | | (_) \ V /| | (_| |  __/ |
    |_|\___/|_| |_|_|   |_|  \___/ \_/ |_|\__,_|\___|_|
 */
/**
 * @name FreeTON connection provider
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

/**
 * Contract class
 */
class Contract {
    constructor(abi, address, ton, parent) {
        //this.provider = provider;
        this.parent = parent;
        this.abi = abi;
        this.address = address;
        //this.contract = new freeton.Contract(provider, abi, address);
        this.ton = ton;


        let that = this;

        //Setup methods
        for (let {name} of abi.functions) {
            if(name === 'constructor') {
                continue;
            }
            this[name] = async function (args = undefined) {
                return await that.getMethod(name, args);
            }

            //Make method deployable
            this[name].deploy = async function (args = undefined) {
                return await that.deployMethod(name, args);
            }
        }
    }

    /**
     * Get current provider
     * @returns {*}
     */
    getProvider() {
        return this.ton;
    }

    /**
     * Get TON client
     * @returns {TONClient}
     */
    getTONClient() {
        return this.ton;
    }

    /**
     * Get raw contract object
     * @returns {*}
     */
    getProviderContract() {
        return this.contract;
    }

    /**
     * Return account info for contract
     * @returns {Promise<*>}
     */
    async getAccount() {
        return await this.ton.contracts.getAccount(this.address);
    }

    /**
     * Return balance for contract
     * @returns {Promise<number>}
     */
    async getBalance() {
        let account = await this.getAccount();
        let balance = Number(account.balance);
        return balance;
    }

    /**
     * Run method locally
     * @param {string} method
     * @param {array|object} args
     * @returns {Promise<*>}
     */
    async getMethod(method, args = {}) {
        let postResult = await $.post('/TonBackendProvider/runLocal/' +
            this.parent.networkServer + "/" + this.address + '/' + method, {
                abi: JSON.stringify(this.abi),
                input: args
            }
            )
        ;

        if(postResult.status === 'error') {
            throw JSON.parse(postResult.encodedError)
        }

        return postResult.result;
    }

    /**
     * Deploy method
     * @param {string} method
     * @param {undefined|array|object} args
     * @returns {Promise<*>}
     */
    async deployMethod(method, args = {}) {
        throw 'Deploy method not supported by TonBackendProvider';
    }

}

export default Contract;