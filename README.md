# TonConnect - Universal FreeTON web provider

Provider available at https://tonconnect.svoi.dev/freeton/getProvider.mjs

## Usage example

```javascript
import {default as getProvider, PROVIDERS, UTILS} from "https://tonconnect.svoi.dev/freeton/getProvider.mjs";

    window.getProvider = getProvider;
    window.PROVIDERS = PROVIDERS;
    window.UTILS = UTILS;


    const DEFAULT_WALLET = PROVIDERS.CrystalWallet;

    let TON = null;
    try {

        //Initialize provider
        TON = await getProvider({}, PROVIDERS.TonBackendWeb);
        await TON.requestPermissions();
        await TON.start();
    } catch (e) {
        console.log(e);
        TON = await getProvider({
            network: 'main',
            networkServer: 'main2.ton.dev'
        }, PROVIDERS.TonBackendWeb);
        await TON.requestPermissions();
        await TON.start();

    }
    window.TON = TON;

    console.log('CURRENT WALLET', await TON.getWallet());
```

## Info

Developed with ❤️ by SVOI.dev Team https://svoi.dev