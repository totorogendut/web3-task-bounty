import { ESCROW_ABI, FACTORY_ABI } from "./_eth-abi";
import { ethChain, factoryContractAddress, tokens } from "./_eth-shared";
import { wallet } from "./wallet.svelte";
import {
	keccak256,
	type Hex,
	createPublicClient,
	http,
	toHex,
	getContract,
	decodeEventLog,
	isHex,
	parseUnits,
} from "viem";
import { erc20Abi } from "viem";

const publicClient = createPublicClient({
	chain: ethChain,
	transport: http(),
});

export const SUBMISSION_TYPEHASH = keccak256(
	toHex("Submission(uint256 bountyId,address freelancer,uint256 submittedAt,uint256 nonce)"),
) as Hex;

export async function createBounty(
	{
		bountyId,
		reward,
		deadline,
	}: {
		bountyId: string;
		reward: string;
		deadline: Date;
	},
	token = tokens.testnet.wethSepolia,
) {
	if (!wallet.client) throw new Error("Wallet client error");
	if (!isHex(factoryContractAddress))
		throw new Error("factoryContractAddress is not Hex type (e.g. 0xabc123)");

	const amount = parseUnits(reward, token.decimal);
	const deadlineInSeconds = BigInt(Math.floor(deadline.getTime() / 1000));

	const approveHash = await wallet.client.writeContract({
		address: token.address,
		abi: erc20Abi,
		functionName: "approve",
		args: [factoryContractAddress, amount],
		chain: ethChain,
		account: wallet.address,
	});

	// wait until mined
	await publicClient.waitForTransactionReceipt({ hash: approveHash });

	const txHash = await wallet.client.writeContract({
		address: factoryContractAddress,
		abi: FACTORY_ABI,
		functionName: "createBounty",
		args: [token.address, keccak256(toHex(bountyId)), amount, deadlineInSeconds],
		gas: 3_000_000n,
		chain: ethChain,
		account: wallet.address,
	});

	console.log(txHash);

	return txHash;
}

export async function getEscrowAddress(txHash: Hex) {
	const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

	const log = receipt.logs.find(
		(l) => l.address.toLowerCase() === factoryContractAddress.toLowerCase(),
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
