const config = {

    explorerUrl: 'https://ton.live/',
    network: 'main',


    // FAVORITO
    bindPort: 3011,
    maxWorkers: 16,
    workerLifetime: 1200 * 1000, //20 mins
    sharedCacheName: 'tonConnect',
    indexController: "Index",
    databases: [],
    secret: "5a0239f8f8ad281983c16ee815974562",
    appUrl: "https://tonlend.com",
    salt: "19d62fc823eb117a148161310e05fba7a",
    uploadDir: "public/uploads",
    allowedExt: ["jpg", "jpeg", "png"],
}


module.exports = config;