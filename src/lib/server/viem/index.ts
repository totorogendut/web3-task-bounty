import { PUBLIC_WALLET_ADDRESS } from "$env/static/public";
import { createPublicClient, createWalletClient, erc20Abi, http, parseEther } from "viem";
import { ethChain, MneeTokenAddress } from "./_shared";
import { privateKeyToAccount } from "viem/accounts";
import { WALLET_PRIVATE_KEY } from "$env/static/private";

const client = createPublicClient({
	chain: ethChain,
	transport: http(),
});

const projectWallet = createWalletClient({
	account: privateKeyToAccount(`0x${WALLET_PRIVATE_KEY}`),
	chain: ethChain,
	transport: http(),
});

export const getPublicWalletFund = async () =>
	client.readContract({
		address: MneeTokenAddress,
		abi: erc20Abi,
		functionName: "balanceOf",
		args: [PUBLIC_WALLET_ADDRESS as `0x${string}`],
	});

export const transferFund = async (to: `0x${string}`, amount: string) => {
	const tx = await projectWallet.writeContract({
		address: MneeTokenAddress,
		abi: erc20Abi,
		functionName: "transfer",
		args: [to, parseEther(amount)],
	});

	return tx;
};
