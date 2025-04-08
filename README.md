# Sentinel Developer Playground

---

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

### WASM

https://github.com/SentinelFi/soroban_vault/tree/main/soroban-4626

Commands to obtain contract WASM:

```
stellar contract build

stellar contract optimize --wasm target/wasm32-unknown-unknown/release/vault.wasm

stellar contract optimize --wasm target/wasm32-unknown-unknown/release/market.wasm

stellar contract install --source-account bob --wasm target/wasm32-unknown-unknown/release/vault.optimized.wasm --network testnet

stellar contract install --source-account bob --wasm target/wasm32-unknown-unknown/release/market.optimized.wasm --network testnet
```

WASM vault:

```
a266febd5b779731664c18156d50895cb1d35e6c43dd33f2f15c704ad70c080f
```

WASM market:

```
bd3c43038d51193306a0d09fff37701a71650ea4efb16b84009241b8dc369ffc
```

---

https://developers.stellar.org/docs/build/guides/transactions/invoke-contract-tx-sdk

---

© All Rights Reserved.
