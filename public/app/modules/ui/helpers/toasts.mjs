export default {

    /**
     * Show toast message
     * @param {string} text
     * @param {string} caption
     * @param {object} options
     */
    toast(text = '', caption = 'Reminder', options = {hideAfter: 3000, icon: 'info', position: 'bottom-right', stack: 6}) {
        $.toast({
            heading: caption,
            text: text,
            ...options
        });
    }
}