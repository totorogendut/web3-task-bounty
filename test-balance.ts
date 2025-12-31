import { createPublicClient, erc20Abi, formatEther, http, parseEther } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
	chain: mainnet,
	transport: http(),
});

const MneeTokenAddress = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF";

const balance = await client.readContract({
	address: MneeTokenAddress,
	abi: erc20Abi,
	functionName: "balanceOf",
	args: [Bun.env.PUBLIC_WALLET_ADDRESS as `0x${string}`],
});

const formattedBalance = formatEther(balance);
const amount = 25.9912949151123213;

console.log({
	formattedBalance,
	balance: parseEther(formattedBalance),
	test: parseEther(amount.toPrecision()),
});
