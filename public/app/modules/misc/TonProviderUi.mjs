import {PROVIDERS} from "../freeton/getProvider.mjs";

/**
 * Disconnect wallets
 * @returns {Promise<void>}
 */
window.disconnectWallet = async function () {
    delete localStorage.wallet;
    await TON.revokePermissions();
    window.location.href = window.location.href;
}

/**
 * Connect crystalWallet
 * @returns {Promise<void>}
 */
window.connectCrystalWallet = async function () {
    localStorage.wallet = PROVIDERS.CrystalWallet;
    window.location.href = window.location.href;
}

/**
 * Connect TonWallet
 * @returns {Promise<void>}
 */
window.connectTonWallet = async function () {
    localStorage.wallet = PROVIDERS.TonWallet;
    window.location.href = window.location.href;
}

window.connectTonWeb = async function () {
    localStorage.wallet = PROVIDERS.TonWeb;
    window.location.href = window.location.href;
}