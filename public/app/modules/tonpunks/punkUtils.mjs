export default {
    /**
     * Convert punk from JSON to internal format
     * @param punk
     * @returns {{badges, punk, rank: (number|*), type}}
     * @private
     */
    _jsonPunkToPunk: (punk) => {
        return {punk: punk.idx, punkType: punk.type, rank: punk.rank, badges: punk.attributes.join(',')}
    },
    /**
     * Extract types and attributes
     * @param punks
     * @param excludesAttributes
     * @returns {{punkTypes: {}, punkAttributes: {}}}
     */
    extractPunkTypesAndAttributes(punks,excludesAttributes = ['CTO', 'Sugar', 'Spice', 'Everything Nice', 'Hacker']) {
        let punkTypes = {};
        let punkAttributes = {};

        for (let punk of punks) {
            if(!punkTypes[punk.type]) {
                punkTypes[punk.type] = 0;
            }
            punkTypes[punk.type]++;

            for (let attribute of punk.attributes) {
                if(excludesAttributes.includes(attribute)) {
                    continue;
                }
                if(!punkAttributes[attribute]) {
                    punkAttributes[attribute] = 0;
                }
                punkAttributes[attribute]++;
            }

        }

        return {punkTypes, punkAttributes};
    }
};