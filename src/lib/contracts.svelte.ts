import { wallet } from "./wallet.svelte";
import { keccak256, encodeAbiParameters, parseAbiParameters, type Hex } from "viem";

export const ESCROW_ABI = [
  {
    inputs: [
      { name: "_taskId", type: "uint256" },
      { name: "_client", type: "address" },
      { name: "_token", type: "address" },
      { name: "_reward", type: "uint128" },
      { name: "_deadline", type: "uint64" },
    ],
    name: "init",
    outputs: [],
    stateMutability: "external",
    type: "function",
  },
  {
    inputs: [
      { name: "_freelancer", type: "address" },
      { name: "workUri", type: "string" },
      { name: "signature", type: "bytes" },
    ],
    name: "awardSubmission",
    outputs: [],
    stateMutability: "external",
    type: "function",
  },
  {
    inputs: [],
    name: "releasePayment",
    outputs: [],
    stateMutability: "external",
    type: "function",
  },
  {
    inputs: [],
    name: "autoRefund",
    outputs: [],
    stateMutability: "external",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "nonces",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const SUBMISSION_TYPEHASH = keccak256(
  Buffer.from("Submission(uint256 taskId,address freelancer,string workUri,uint256 nonce)"),
) as Hex;

export async function signSubmission({
  escrowAddress,
  taskId,
  workUri,
}: {
  escrowAddress: Hex;
  taskId: number;
  workUri: string;
}) {
  if (!wallet.client || !wallet.address) throw new Error("Wallet not connected");

  const nonce = await wallet.client.readContract({
    address: escrowAddress,
    abi: ESCROW_ABI,
    functionName: "nonces",
    args: [wallet.address],
  });

  const domain = {
    name: "FreelanceEscrow",
    version: "1",
    chainId: wallet.chainId!,
    verifyingContract: escrowAddress,
  } as const;

  const types = {
    Submission: [
      { name: "taskId", type: "uint256" },
      { name: "freelancer", type: "address" },
      { name: "workUri", type: "string" },
      { name: "nonce", type: "uint256" },
    ],
  } as const;

  const message = {
    taskId: BigInt(taskId),
    freelancer: wallet.address,
    workUri,
    nonce,
  } as const;

  return wallet.client.signTypedData({
    account: wallet.address,
    domain,
    types,
    primaryType: "Submission",
    message,
  });
}

export async function awardSubmission({
  escrowAddress,
  freelancer,
  workUri,
  signature,
}: {
  escrowAddress: Hex;
  freelancer: Hex;
  workUri: string;
  signature: Hex;
}) {
  if (!wallet.client || !wallet.address) throw new Error("Wallet not connected");

  return wallet.client.writeContract({
    account: wallet.address,
    address: escrowAddress,
    abi: ESCROW_ABI,
    functionName: "awardSubmission",
    args: [freelancer, workUri, signature],
  });
}

export async function releasePayment(escrowAddress: Hex) {
  if (!wallet.client || !wallet.address) throw new Error("Wallet not connected");

  return wallet.client.writeContract({
    account: wallet.address,
    address: escrowAddress,
    abi: ESCROW_ABI,
    functionName: "releasePayment",
  });
}
