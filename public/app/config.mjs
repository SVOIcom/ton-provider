/**
 * Configuration
 */
export default {
    //Test network config
    test: {
        punkAddress: '0:cf6adf8c52e0700ed853822490a9869494942e5725ff7995af714fa504f3198f',
        explorerUrl: 'https://net.ton.live'
    },

    'net1.ton.dev': {
        punkAddress: '0:cf6adf8c52e0700ed853822490a9869494942e5725ff7995af714fa504f3198f',
        explorerUrl: 'https://net.ton.live'
    },
    //Main network config
    main: {
        punkAddress: '0:10c094a246e044ce080777cf1ae6294d0a4c924ac17a19e22528d120bd7a63e5',
        explorerUrl: 'https://ton.live'
    },
    'main.ton.dev': {
        punkAddress: '0:10c094a246e044ce080777cf1ae6294d0a4c924ac17a19e22528d120bd7a63e5',
        explorerUrl: 'https://ton.live'
    },
    'main1.ton.dev': {
        punkAddress: '0:10c094a246e044ce080777cf1ae6294d0a4c924ac17a19e22528d120bd7a63e5',
        explorerUrl: 'https://ton.live'
    },
    'main2.ton.dev': {
        punkAddress: '0:10c094a246e044ce080777cf1ae6294d0a4c924ac17a19e22528d120bd7a63e5',
        explorerUrl: 'https://ton.live'
    },
    'main3.ton.dev': {
        punkAddress: '0:10c094a246e044ce080777cf1ae6294d0a4c924ac17a19e22528d120bd7a63e5',
        explorerUrl: 'https://ton.live'
    },


    siteAddress: 'https://tonpunks.com',


//Server address used by default
    defaultNetworkServer: 'main2.ton.dev',
    //Name of network used by default
    defaultNetwork: 'main',

    //Server address used by default
    //defaultNetworkServer: 'net1.ton.dev',
    //Name of network used by default
    //defaultNetwork: 'test',

    //Disable browser extension
    disableTONWallet: false
}