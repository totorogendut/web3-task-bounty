import { createWalletClient, custom, type WalletClient } from "viem";
import { mainnet, sepolia } from "viem/chains";

class WalletState {
	address = $state<`0x${string}` | null>(null);
	chainId = $state<number | null>(null);
	isConnected = $derived(this.address !== null);
	client = $state<WalletClient | null>(null);

	constructor() {
		if (typeof window !== "undefined" && (window as any).ethereum) {
			this.init();
		}
	}

	private async init() {
		const ethereum = (window as any).ethereum;

		ethereum.on("accountsChanged", (accounts: string[]) => {
			this.address = accounts.length > 0 ? (accounts[0] as `0x${string}`) : null;
		});

		ethereum.on("chainChanged", (chainId: string) => {
			this.chainId = parseInt(chainId, 16);
		});

		// Check if already connected
		const accounts = await ethereum.request({ method: "eth_accounts" });
		if (accounts.length > 0) {
			this.address = accounts[0] as `0x${string}`;
			const chainId = await ethereum.request({ method: "eth_chainId" });
			this.chainId = parseInt(chainId, 16);
			this.client = createWalletClient({
				chain: this.chainId === 11155111 ? sepolia : mainnet,
				transport: custom(ethereum),
			});
		}
	}

	async connect() {
		if (typeof window === "undefined" || !(window as any).ethereum) {
			throw new Error("No ethereum provider found");
		}

		const ethereum = (window as any).ethereum;
		const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		this.address = accounts[0] as `0x${string}`;

		const chainId = await ethereum.request({ method: "eth_chainId" });
		this.chainId = parseInt(chainId, 16);

		this.client = createWalletClient({
			account: this.address,
			chain: this.chainId === 11155111 ? sepolia : mainnet,
			transport: custom(ethereum),
		});
	}

	async disconnect() {
		this.address = null;
		this.client = null;
	}
}

export const wallet = new WalletState();
