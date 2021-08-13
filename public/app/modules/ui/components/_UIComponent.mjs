/*
  _______ ____  _   _ _                    _
 |__   __/ __ \| \ | | |                  | |
    | | | |  | |  \| | |     ___ _ __   __| |
    | | | |  | | . ` | |    / _ \ '_ \ / _` |
    | | | |__| | |\  | |___|  __/ | | | (_| |
    |_|  \____/|_| \_|______\___|_| |_|\__,_|
 */

/**
 * @name TONLend - DeFi lending for FreeTON
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

/**
 * UI component abstract
 * @abstract
 */
class _UIComponent extends EventEmitter3 {
    constructor(pageId, domObject, id,) {
        super();
        this.pageId = pageId;
        this.domObject = domObject;
        this.id = id;
    }

    /**
     * Initialize UI component
     * @returns {Promise<_UIComponent>}
     */
    async init() {
        return this;
    }

    /**
     * Emit event
     * @param args
     * @returns {*}
     */
    emit(...args) {
        return super.emit(...args);
    }

    /**
     * Destroy component
     * @returns {Promise<void>}
     */
    async destroy() {
        this.domObject.remove();
    }
}

export default _UIComponent;