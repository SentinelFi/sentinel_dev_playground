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
export async function generateFundedKeypair() {
  const keypair = Keypair.random();
  const server = new Server(rpcUrl);
  await server.requestAirdrop(keypair.publicKey());
  return keypair;
}

export async function initMarket(contractID: string): Promise<string> {
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

    const res = await client.init({
      user: sourceKeypair.publicKey(),
      data: {
        name: "Nms",
        description: "Desc",
        admin_address: sourceKeypair.publicKey(),
        asset_address:
          "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
        trusted_oracle_name: "Test",
        trusted_oracle_address:
          "GDVZSDU6YDZ53CFP4BMMAXDC4Y3UXOXT3N73MXKK2XPSRBJMZXZ5ZFV5",
        hedge_vault_address:
          "CAFZTNZ747ZEBAO242AX5WSPPIA65RDD6DGPEOYOWAS5BOM6TEA36AJZ",
        risk_vault_address:
          "CBSX6LLBTI7QBF26QCIIZUPUCGHH3SNWKLPNX7ZMPWMJK77Z2ZRHMLT5",
        commission_fee: 5,
        risk_score: 1,
        is_automatic: true,
        event_unix_timestamp: 1746651600,
        lock_period_in_seconds: 600,
        event_threshold_in_seconds: 600,
        unlock_period_in_seconds: 600,
      },
    });

    const sent = await res.signAndSend();

    console.log("Market init result:", sent.result);
    console.log("Market init result:", res);

    return JSON.stringify(sent.result);
  } catch (e) {
    console.log("Failed to init market:", e);
    return "Error: " + e;
  }
}
