let tonInstances = {};

module.exports = async function getTonInstance(network = 'main2.ton.dev') {
    if(tonInstances[network]) {
        return tonInstances[network];
    }

    const {TonClient} = require('@tonclient/core');
    const {libNode} = require("@tonclient/lib-node");
    TonClient.useBinaryLibrary(libNode);

    let TON = tonInstances[network] = new TonClient({
        network: {
            server_address: network
        }
    });

    tonInstances[network].runLocal = async (address, abi, functionName, input = {})=>{
        const account = (await TON.net.query_collection({
            collection: 'accounts',
            filter: { id: { eq: address } },
            result: 'boc'
        })).result[0].boc;

        const message = await TON.abi.encode_message({
            abi: {
                type: 'Json',
                value: (abi)
            },
            address: address,
            call_set: {
                function_name: functionName,
                input: input
            },
            signer: {
                type: 'None'
            }
        });

        let response = await TON.tvm.run_tvm({
            message: message.message,
            account: account,
            abi: {
                type: 'Json',
                value: (abi)
            },
        });

        return response.decoded.output;
    }

    return tonInstances[network]
}