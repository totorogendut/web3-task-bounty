import { erc20Abi, createPublicClient, http, type Hex } from "viem";
import { sepolia } from "viem/chains";
import { ethChain } from "./_shared";

// Server-side public client for Sepolia
export const publicClient = createPublicClient({
	chain: ethChain,
	transport: http(),
});

// ABI for the FreelanceEscrowFactory based on factory-contract.sol
export const FACTORY_ABI = [
	{
		inputs: [
			{ name: "token", type: "address" },
			{ name: "reward", type: "uint128" },
			{ name: "deadline", type: "uint64" },
		],
		name: "createBounty",
		outputs: [{ name: "escrow", type: "address" }],
		stateMutability: "external",
		type: "function",
	},
	{
		inputs: [],
		name: "bountyCount",
		outputs: [{ name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, name: "bountyId", type: "uint256" },
			{ indexed: false, name: "escrow", type: "address" },
			{ indexed: false, name: "client", type: "address" },
			{ indexed: false, name: "token", type: "address" },
			{ indexed: false, name: "reward", type: "uint256" },
			{ indexed: false, name: "deadline", type: "uint64" },
		],
		name: "EscrowCreated",
		type: "event",
	},
] as const;

/**
 * Server-side helper to get factory bounty count.
 */
export async function getBountyCount(factoryAddress: Hex) {
	return publicClient.readContract({
		address: factoryAddress,
		abi: FACTORY_ABI,
		functionName: "bountyCount",
	});
}
