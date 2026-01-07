import { PUBLIC_FACTORY_ADDRESS } from "$env/static/public";
import { ESCROW_ABI, FACTORY_ABI } from "./_eth-abi";
import { ethChain } from "./_eth-shared";
import { wallet } from "./wallet.svelte";
import {
	keccak256,
	type Hex,
	createPublicClient,
	http,
	toHex,
	getContract,
	parseEther,
	decodeEventLog,
	isHex,
} from "viem";

const publicClient = createPublicClient({
	chain: ethChain,
	transport: http(),
});

export const SUBMISSION_TYPEHASH = keccak256(
	toHex("Submission(uint256 bountyId,address freelancer,uint256 submittedAt,uint256 nonce)"),
) as Hex;

export async function createBounty({
	bountyId,
	tokenAddress,
	reward,
	deadline,
}: {
	bountyId: string;
	tokenAddress: Hex;
	// ===========TOKEN ADDRESS============
	// MNEE: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
	reward: string;
	deadline: Date;
}) {
	if (!wallet.client) throw new Error("Wallet client error");
	if (!isHex(PUBLIC_FACTORY_ADDRESS))
		throw new Error("PUBLIC_FACTORY_ADDRESS is not Hex type (e.g. 0xabc123)");

	const factory = getContract({
		address: PUBLIC_FACTORY_ADDRESS,
		abi: FACTORY_ABI,
		client: wallet.client,
	});

	const amount = parseEther(reward);

	const txHash = await factory.write.createBounty(
		[tokenAddress, keccak256(toHex(bountyId)), amount, BigInt(deadline.getTime() / 1000)],
		{ chain: ethChain, account: wallet.address },
	);

	return txHash;
}

export async function getEscrowAddress(txHash: Hex) {
	const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

	const log = receipt.logs.find(
		(l) => l.address.toLowerCase() === PUBLIC_FACTORY_ADDRESS.toLowerCase(),
	);

	if (!log) throw new Error("Receipt log not found");

	const event = decodeEventLog({
		abi: FACTORY_ABI,
		data: log.data,
		topics: log.topics,
	});

	return event.args.escrow;
}

export async function signSubmission({
	escrowAddress,
	bountyId,
}: {
	escrowAddress: Hex;
	bountyId: string;
}): Promise<{
	submittedAt: number;
	signature: Hex;
}> {
	if (!wallet.client || !wallet.address || !wallet.chainId) throw new Error("Wallet not connected");

	const nonce = await publicClient.readContract({
		address: escrowAddress,
		abi: ESCROW_ABI,
		functionName: "nonces",
		args: [wallet.address],
	});

	if (typeof nonce !== "bigint") throw new Error("Nonce is not bigint.");

	const submittedAt = Math.floor(Date.now() / 1000);
	const domain = {
		name: "FreelanceEscrow",
		version: "1",
		chainId: wallet.chainId,
		verifyingContract: escrowAddress,
	};

	const types = {
		Submission: [
			{ name: "bountyId", type: "bytes32" },
			{ name: "freelancer", type: "address" },
			{ name: "submittedAt", type: "uint256" },
			{ name: "nonce", type: "uint256" },
		],
	};

	const message = {
		bountyId: keccak256(toHex(bountyId)),
		freelancer: wallet.address,
		submittedAt,
		nonce,
	} as const;

	const signature = await wallet.client.signTypedData({
		account: wallet.address,
		domain,
		types,
		primaryType: "Submission",
		message,
	});

	return { signature, submittedAt };
}

export async function awardSubmission({
	escrowAddress,
	freelancer,
	submittedAt,
	signature,
}: {
	escrowAddress: Hex;
	freelancer: Hex;
	submittedAt: number;
	signature: Hex;
}) {
	if (!wallet.client || !wallet.address) throw new Error("Wallet not connected");

	const { request } = await publicClient.simulateContract({
		account: wallet.address,
		address: escrowAddress,
		abi: ESCROW_ABI,
		functionName: "awardSubmission",
		args: [freelancer, BigInt(submittedAt), signature],
	});

	return wallet.client.writeContract(request);
}

export async function releasePayment(escrowAddress: Hex) {
	if (!wallet.client || !wallet.address) throw new Error("Wallet not connected");

	const { request } = await publicClient.simulateContract({
		account: wallet.address,
		address: escrowAddress,
		abi: ESCROW_ABI,
		functionName: "releasePayment",
	});

	return wallet.client.writeContract(request);
}

export async function autoRefund(escrowAddress: Hex) {
	if (!wallet.client || !wallet.address) throw new Error("Wallet not connected");

	const { request } = await publicClient.simulateContract({
		account: wallet.address,
		address: escrowAddress,
		abi: ESCROW_ABI,
		functionName: "autoRefund",
	});

	return wallet.client.writeContract(request);
}
