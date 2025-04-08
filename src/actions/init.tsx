"use server";

import { Keypair } from "@stellar/stellar-sdk";
import { Client, basicNodeSigner } from "@stellar/stellar-sdk/contract";
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

export async function generateNewPublicKey(): Promise<string> {
  const keypair = Keypair.random();
  return keypair.publicKey();
}

export async function initMarket(
  contractID: string,
  name: string,
  description: string,
  asset_address: string,
  trusted_oracle_name: string,
  trusted_oracle_address: string,
  hedge_vault_address: string,
  risk_vault_address: string,
  commission_fee: number,
  risk_score: number,
  is_automatic: boolean,
  event_unix_timestamp: number,
  lock_period_in_seconds: number,
  event_threshold_in_seconds: number,
  unlock_period_in_seconds: number
): Promise<string> {
  try {
    if (!contractID) return "Empty market contract ID.";

    console.log("Market Contract", contractID);

    const sourceKeypair = await generateFundedKeypair();

    const { signTransaction } = basicNodeSigner(
      sourceKeypair,
      networkPassphrase
    );

    const options: any = {
      contractId: contractID,
      networkPassphrase,
      rpcUrl,
      wasmHash,
      publicKey: sourceKeypair.publicKey(),
      signTransaction,
    };

    const client: any = await Client.from(options);

    const initTransaction = await client.init({
      user: sourceKeypair.publicKey(),
      data: {
        name,
        description,
        admin_address: sourceKeypair.publicKey(),
        asset_address,
        trusted_oracle_name,
        trusted_oracle_address,
        hedge_vault_address,
        risk_vault_address,
        commission_fee,
        risk_score,
        is_automatic,
        event_unix_timestamp,
        lock_period_in_seconds,
        event_threshold_in_seconds,
        unlock_period_in_seconds,
      },
    });

    const sent = await initTransaction.signAndSend();

    console.log("Market init result:", sent.result);
    console.log("Market init full result:", sent);

    return JSON.stringify(sent.result);
  } catch (e) {
    console.log("Failed to init market:", e);
    return "Error: " + e;
  }
}
