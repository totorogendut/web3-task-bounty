export const ESCROW_ABI = [
	/* ========= READ ========= */

	{
		type: "function",
		name: "bounty",
		stateMutability: "view",
		inputs: [],
		outputs: [
			{ name: "client", type: "address" },
			{ name: "deadline", type: "uint48" },
			{ name: "bountyId", type: "bytes32" },
			{ name: "status", type: "uint8" },
			{ name: "token", type: "address" },
			{ name: "reward", type: "uint96" },
		],
	},

	{
		type: "function",
		name: "freelancer",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "address" }],
	},

	{
		type: "function",
		name: "nonces",
		stateMutability: "view",
		inputs: [{ name: "", type: "address" }],
		outputs: [{ type: "uint256" }],
	},

	{
		type: "function",
		name: "platformFeeBps",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "uint16" }],
	},

	{
		type: "function",
		name: "feeRecipient",
		stateMutability: "view",
		inputs: [],
		outputs: [{ type: "address" }],
	},

	/* ========= WRITE ========= */

	{
		type: "function",
		name: "awardSubmission",
		stateMutability: "nonpayable",
		inputs: [
			{ name: "freelancer", type: "address" },
			{ name: "submittedAt", type: "uint256" },
			{ name: "signature", type: "bytes" },
		],
		outputs: [],
	},

	{
		type: "function",
		name: "releasePayment",
		stateMutability: "nonpayable",
		inputs: [],
		outputs: [],
	},

	{
		type: "function",
		name: "autoRefund",
		stateMutability: "nonpayable",
		inputs: [],
		outputs: [],
	},

	/* ========= EVENTS ========= */

	{
		type: "event",
		name: "BountyAwarded",
		inputs: [{ name: "freelancer", type: "address", indexed: true }],
	},

	{
		type: "event",
		name: "PaymentReleased",
		inputs: [
			{ name: "freelancer", type: "address", indexed: true },
			{ name: "payout", type: "uint256", indexed: false },
		],
	},

	{
		type: "event",
		name: "BountyRefunded",
		inputs: [{ name: "client", type: "address", indexed: true }],
	},
] as const;

export const FACTORY_ABI = [
	{
		type: "function",
		name: "createBounty",
		stateMutability: "nonpayable",
		inputs: [
			{ name: "token", type: "address" },
			{ name: "bountyId", type: "bytes32" },
			{ name: "reward", type: "uint128" },
			{ name: "deadline", type: "uint64" },
		],
		outputs: [{ name: "escrow", type: "address" }],
	},
	{
		type: "event",
		name: "EscrowCreated",
		inputs: [
			{ name: "bountyId", type: "bytes32", indexed: true },
			{ name: "escrow", type: "address", indexed: false },
			{ name: "client", type: "address", indexed: true },
			{ name: "token", type: "address", indexed: false },
			{ name: "reward", type: "uint256", indexed: false },
			{ name: "deadline", type: "uint64", indexed: false },
		],
	},
] as const;
