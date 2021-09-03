import utils from "../../utils.mjs";

class Popups {
    /**
     *
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * Create popup HTML
     * @param caption
     * @param options
     * @param contentHTML
     * @param footerHTML
     * @returns {Promise<{name: number, html: string}>}
     */
    async buildPopupHTML(caption = '', options = {}, contentHTML = '', footerHTML = '') {
        let innerHTML = `<content>${contentHTML}</content>`;
        innerHTML += `<footer>${footerHTML}</footer>`;

        let name = utils.randomId();

        return {name, html: this.page.constructComponent('popup', {...options, caption, name}, innerHTML)};
    }

    /**
     * Start popup component on page
     * @param popupObj
     * @returns {Promise<*>}
     */
    async startPopup(popupObj) {
        await this.page.appendComponents(popupObj.html);
        return this.page.components[popupObj.name];
    }

    /**
     * Create and start popup
     * @param caption
     * @param options
     * @param contentHTML
     * @param footerHTML
     * @returns {Promise<*>}
     */
    async popup(caption = '', options = {}, contentHTML = '', footerHTML = '') {
        let popupObj = await this.buildPopupHTML(caption, options, contentHTML, footerHTML);
        return await this.startPopup(popupObj);
    }

    /**
     * Show modal alert
     * @param caption
     * @param message
     * @param buttonText
     * @returns {Promise<void>}
     */
    async alert(caption = 'Message', message = '', buttonText = 'OK') {
        await new Promise(async resolve => {
            let popup = await this.popup(caption, {}, message, `
                <fw-component  type="Button" data-dismiss="modal">${buttonText}</fw-component>
            `);
            popup.on('close', async () => {
                await popup.destroy();
                resolve();
            });
            await popup.show();
        })
    }

    /**
     * Show erro message
     * @param caption
     * @param message
     * @returns {Promise<void>}
     */
    async error(caption = 'Error', message = 'Something happens') {
        return await this.alert('⚠️' + caption, message, 'Close');
    }
}

export default Popups;