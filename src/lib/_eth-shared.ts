import type { Hex } from "viem";
import { mainnet, sepolia } from "viem/chains";

export const ethChain = sepolia;
export const factoryContractAddress = "0x0e5ac1741b47d03a3e1b491af1ec0576f13cb652" as const;
export const escrowStatusEnum = [
	"approval_pending",
	"approval_reverted",
	"approval_success",
	"mint_pending",
	"mint_reverted",
	"mint_success",
	"bid_open",
	"bid_closed",
	"finished",
] as const;

export type EscrowStatus = (typeof escrowStatusEnum)[number];
interface ERC20Token {
	address: Hex;
	label: string;
	decimal: number;
	icon?: string;
}

const tokenIcons = import.meta.glob(
	"/src/lib/assets/token/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}",
	{
		eager: true,
		query: {
			enhanced: true,
		},
	},
);

const getIcon = (token: keyof typeof tokens.mainnet) =>
	(tokenIcons[`/src/lib/assets/token/${token}.png`] as any)?.default as string;

interface Tokens {
	mainnet: {
		mnee: ERC20Token;
		usdc: ERC20Token;
		usdt: ERC20Token;
		dai: ERC20Token;
		wbtc: ERC20Token;
		link: ERC20Token;
		shib: ERC20Token;
		uni: ERC20Token;
	};
	testnet: {
		wethSepolia: ERC20Token;
	};
}

export const tokens: Tokens = {
	mainnet: {
		mnee: {
			address: "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF",
			label: "MNEE USD Stablecoin",
			decimal: 18,
			icon: getIcon("mnee"),
		},
		usdc: {
			address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
			label: "USDC",
			decimal: 6,
		},
		usdt: {
			address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
			label: "Tether USD",
			decimal: 6,
		},
		dai: {
			address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
			label: "DAI Stablecoin",
			decimal: 18,
		},
		wbtc: {
			address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
			label: "Wrapped Bitcoin",
			decimal: 8,
		},
		link: {
			address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
			label: "Chainlink Token",
			decimal: 18,
		},
		shib: {
			address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
			label: "SHIBA INU",
			decimal: 18,
		},
		uni: {
			address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
			label: "Uniswap",
			decimal: 18,
		},
	},
	testnet: {
		wethSepolia: {
			address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
			label: "WETH Sepolia",
			decimal: 18,
		},
	},
} as const;
