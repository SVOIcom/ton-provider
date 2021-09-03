console.log('Test MJS');

export default {
    methods: {
        debugLog: (...debug) => {
            console.log('TEST MJS:', ...debug);
        },
        init: async (page) => {
            console.log('MJS TEST PAGE INIT', page);
        }
    }
};