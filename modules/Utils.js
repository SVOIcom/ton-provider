module.exports = {


    /**
     * Расстояние между двумя GPS координатами
     * @param {number} lat1
     * @param {number} lon1
     * @param {number} lat2
     * @param {number} lon2
     * @returns {number}
     */
    haversineDistance: function (lat1, lon1, lat2, lon2) {
        const EARTH_RADIUS = 6378.137; // Radius of earth in KM
        let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = EARTH_RADIUS * c;
        return d * 1000; // meters
    },

    /**
     * Создание строки поиска по тексту
     * @param objects
     * @returns {string}
     */
    createSearcher(...objects) {
        let searcherStr = JSON.stringify(objects);
        return JSON.stringify({down: searcherStr.toLowerCase(), up: searcherStr.toUpperCase()});
    },

}