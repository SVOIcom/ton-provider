
const config = {

    explorerUrl: 'https://ton.live/',
    network: 'main',


    // FAVORITO
    bindPort: 3004,
    maxWorkers: 1,
    sharedCacheName: 'tonLend',
    indexController: "Index",
    databases: [
        /* {
             type: "sequelize",
             name: "newdb",
             config: {path: "mysql://chats:d281983c@localhost:3306/chats"},
         },*/

    ],
    secret: "5a0239f8f8ad281983c16ee815974562",
    appUrl: "https://tonlend.com",
    salt: "19d62fc823eb117a148161310e05fba7a",
    uploadDir: "public/uploads",
    allowedExt: ["jpg", "jpeg", "png"],
}



module.exports = config;