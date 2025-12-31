import { PUBLIC_WALLET_ADDRESS } from "$env/static/public";
import {
	createPublicClient,
	createWalletClient,
	erc20Abi,
	formatEther,
	formatUnits,
	http,
	parseEther,
	parseUnits,
} from "viem";
import { mainnet } from "viem/chains";
import { MneeTokenAddress } from "./_shared";
import { privateKeyToAccount } from "viem/accounts";
import { WALLET_PRIVATE_KEY } from "$env/static/private";

const client = createPublicClient({
	chain: mainnet,
	transport: http(),
});

const wallet = createWalletClient({
	account: privateKeyToAccount(WALLET_PRIVATE_KEY as `0x${string}`),
	chain: mainnet,
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
	const tx = await wallet.writeContract({
		address: MneeTokenAddress,
		abi: erc20Abi,
		functionName: "transfer",
		args: [to, parseEther(amount)],
	});

	return tx;
};
