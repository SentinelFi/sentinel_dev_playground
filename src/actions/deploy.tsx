"use server";

import { Keypair } from "@stellar/stellar-sdk";
import { Client, basicNodeSigner } from "@stellar/stellar-sdk/contract";
import { Server } from "@stellar/stellar-sdk/rpc";

/* Constants Config */
const rpcUrl = "https://soroban-testnet.stellar.org";
const networkPassphrase = "Test SDF Network ; September 2015";
const wasmHashMarket =
  "bd3c43038d51193306a0d09fff37701a71650ea4efb16b84009241b8dc369ffc";
const wasmHashVault =
  "a266febd5b779731664c18156d50895cb1d35e6c43dd33f2f15c704ad70c080f";

/*
 * Generate a random keypair and fund it
 */
export async function generateFundedKeypair() {
  const keypair = Keypair.random();
  const server = new Server(rpcUrl);
  await server.requestAirdrop(keypair.publicKey());
  return keypair;
}

export async function deployMarketContract() {
  try {
    const sourceKeypair = await generateFundedKeypair();

    const { signTransaction } = basicNodeSigner(
      sourceKeypair,
      networkPassphrase
    );

    const deployTx = await Client.deploy(null, {
      networkPassphrase,
      rpcUrl,
      wasmHash: wasmHashMarket,
      publicKey: sourceKeypair.publicKey(),
      signTransaction,
    });

    const { result: client } = await deployTx.signAndSend();
    const id = client?.options?.contractId;

    console.log(id);
    return id;
  } catch (e) {
    console.log("Failed to deploy market:", e);
    return "";
  }
}
