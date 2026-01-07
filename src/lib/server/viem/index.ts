import { PUBLIC_PLATFORM_ADDRESS } from "$env/static/public";
import { createPublicClient, createWalletClient, erc20Abi, http, parseEther } from "viem";
import { ethChain, MneeTokenAddress } from "../../_eth-shared";
import { privateKeyToAccount } from "viem/accounts";

const client = createPublicClient({
	chain: ethChain,
	transport: http(),
});
