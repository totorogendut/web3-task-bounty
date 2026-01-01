import { createWalletClient, custom, type Hex, type WalletClient } from "viem";
import { mainnet, sepolia } from "viem/chains";
import { page } from "$app/state";
import { logout } from "./user.svelte";

class WalletState {
	address = $state<Hex | null>(null);
	chainId = $state<number | null>(null);
	isConnected = $derived(this.address !== null);
	client = $state<WalletClient | null>(null);

	constructor() {
		if (typeof window !== "undefined" && window.ethereum) {
			this.init();
		}
	}

	private async init() {
		if (window.ethereum) {
			//@ts-ignore
			window.ethereum.on("accountsChanged", (accounts: Hex[]) => {
				this.address = accounts.length > 0 ? accounts[0] : null;
				if (!this.address) logout();
			});

			//@ts-ignore
			window.ethereum.on("chainChanged", (chainId: string) => {
				this.chainId = parseInt(chainId, 16);
			});
		}

		// Check if already connected

		if (!page.data.user) return;
		try {
			const { address } = await setupClient(this);
			this.address = address;
			const chainId = (await window.ethereum!.request({ method: "eth_chainId" })) as Hex;
			this.chainId = parseInt(chainId, 16);
		} catch (error) {
			logout();
		}
	}

	async connect() {
		if (typeof window === "undefined" || !(window as any).ethereum) {
			throw new Error("No ethereum provider found");
		}

		const { address, ethereum } = await setupClient(this);

		try {
			await signAccount(this.client, address);
		} catch (error) {
			console.error(error);
			console.error("Sign in failed");
			return;
		}

		window.location.pathname = "/";
	}

	async disconnect() {
		this.address = null;
		this.client = null;
	}
}

export const wallet = new WalletState();

async function setupClient(thisWallet: WalletState) {
	const ethereum = window.ethereum;
	if (!ethereum) throw new Error("Error initializing web3 wallet.");
	const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as Hex[];
	if (accounts?.length < 1) throw new Error("No web3 wallet account found.");
	const address = accounts[0] as Hex;
	thisWallet.client = createWalletClient({
		account: address,
		chain: thisWallet.chainId === 11155111 ? sepolia : mainnet,
		transport: custom(ethereum),
	});

	return {
		address,
		ethereum,
	};
}

async function signAccount(client: typeof wallet.client, address: Hex) {
	if (!client) throw new Error("Wallet client has not yet initialized.");
	const nonceRes = await fetch("/auth/nonce/", {
		method: "POST",
		body: JSON.stringify({
			address,
		}),
	});
	if (!nonceRes.ok) throw new Error("Error issuing nonce.");
	const nonce = await nonceRes.text();
	// Sign message
	const message = `Sign this message to login:\nNonce: ${nonce}`;
	const signature = await client.signMessage({
		account: address,
		message,
	});

	const verifyRes = await fetch("/auth/verify/", {
		method: "POST",
		body: JSON.stringify({
			address,
			signature,
		}),
	});
}
