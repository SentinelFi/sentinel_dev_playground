"use server";

import { Keypair } from "@stellar/stellar-sdk";
import { basicNodeSigner, Client } from "@stellar/stellar-sdk/contract";
import { Server } from "@stellar/stellar-sdk/rpc";

/* Constants Config */
const rpcUrl = "https://soroban-testnet.stellar.org";
const networkPassphrase = "Test SDF Network ; September 2015";
const wasmHash =
  "bd3c43038d51193306a0d09fff37701a71650ea4efb16b84009241b8dc369ffc";

/*
 * Generate a random keypair and fund it
 */
async function generateFundedKeypair() {
  const keypair = Keypair.random();
  const server = new Server(rpcUrl);
  await server.requestAirdrop(keypair.publicKey());
  return keypair;
}

export async function callWriteContractFunction(
  contractID: string,
  functionName: string,
  params: Record<string, any>
) {
  try {
    if (!contractID) return "Empty market contract ID.";

    const sourceKeypair = await generateFundedKeypair();

    const { signTransaction } = basicNodeSigner(
      sourceKeypair,
      networkPassphrase
    );

    const options = {
      contractId: contractID,
      networkPassphrase,
      rpcUrl,
      wasmHash,
      publicKey: sourceKeypair.publicKey(),
      signTransaction,
    };

    const client: any = await Client.from(options);

    const functionParams = {
      user: sourceKeypair.publicKey(),
      ...params,
    };

    // Dynamically call the function on the client object
    const transaction = await client[functionName](functionParams);

    const sent = await transaction.signAndSend();

    const { result } = sent;

    console.log(`${functionName} result:`, result);
    console.log("Full result:", sent);

    return JSON.stringify(result, valueReplacer);
  } catch (e) {
    console.log(`Failed to call ${functionName}:`, e);
    return "Error: " + e;
  }
}

export async function callReadContractFunction(
  contractID: string,
  functionName: string,
  params: Record<string, any>
) {
  try {
    if (!contractID) return "Empty market contract ID.";

    const sourceKeypair = await generateFundedKeypair();

    const { signTransaction } = basicNodeSigner(
      sourceKeypair,
      networkPassphrase
    );

    const options = {
      contractId: contractID,
      networkPassphrase,
      rpcUrl,
      wasmHash,
      publicKey: sourceKeypair.publicKey(),
      signTransaction,
    };

    const client: any = await Client.from(options);

    const functionParams = {
      user: sourceKeypair.publicKey(),
      ...params,
    };

    // Dynamically call the function on the client object
    const res = await client[functionName](functionParams);

    const { result } = res;

    console.log(`${functionName} result:`, result);
    console.log("Full result:", res);

    return JSON.stringify(result, valueReplacer);
  } catch (e) {
    console.log(`Failed to call ${functionName}:`, e);
    return "Error: " + e;
  }
}

const valueReplacer = (_key: any, value: any) => {
  console.log(typeof value);
  if (typeof value === "bigint") {
    return Number(value);
  }
  return value;
};
