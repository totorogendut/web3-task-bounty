export const ESCROW_ABI = [
	{
		inputs: [
			{
				internalType: "uint16",
				name: "feeBps",
				type: "uint16",
			},
			{
				internalType: "address",
				name: "feeAddr",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "AlreadyInitialized",
		type: "error",
	},
	{
		inputs: [],
		name: "DeadlinePassed",
		type: "error",
	},
	{
		inputs: [],
		name: "ECDSAInvalidSignature",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "length",
				type: "uint256",
			},
		],
		name: "ECDSAInvalidSignatureLength",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32",
			},
		],
		name: "ECDSAInvalidSignatureS",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidDeadline",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidShortString",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidSignature",
		type: "error",
	},
	{
		inputs: [],
		name: "NotAwarded",
		type: "error",
	},
	{
		inputs: [],
		name: "NotClient",
		type: "error",
	},
	{
		inputs: [],
		name: "NotOpen",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address",
			},
		],
		name: "SafeERC20FailedOperation",
		type: "error",
	},
	{
		inputs: [],
		name: "SignatureExpired",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "str",
				type: "string",
			},
		],
		name: "StringTooLong",
		type: "error",
	},
	{
		inputs: [],
		name: "TooEarly",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "freelancer",
				type: "address",
			},
		],
		name: "BountyAwarded",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "client",
				type: "address",
			},
		],
		name: "BountyRefunded",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [],
		name: "EIP712DomainChanged",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "freelancer",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "payout",
				type: "uint256",
			},
		],
		name: "PaymentReleased",
		type: "event",
	},
	{
		inputs: [],
		name: "autoRefund",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_freelancer",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "submittedAt",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "signature",
				type: "bytes",
			},
		],
		name: "awardWinningBid",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "bounty",
		outputs: [
			{
				internalType: "address",
				name: "client",
				type: "address",
			},
			{
				internalType: "uint48",
				name: "deadline",
				type: "uint48",
			},
			{
				internalType: "bytes32",
				name: "bountyId",
				type: "bytes32",
			},
			{
				internalType: "enum FreelanceEscrowEIP712.Status",
				name: "status",
				type: "uint8",
			},
			{
				internalType: "contract IERC20",
				name: "token",
				type: "address",
			},
			{
				internalType: "uint96",
				name: "reward",
				type: "uint96",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "eip712Domain",
		outputs: [
			{
				internalType: "bytes1",
				name: "fields",
				type: "bytes1",
			},
			{
				internalType: "string",
				name: "name",
				type: "string",
			},
			{
				internalType: "string",
				name: "version",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "chainId",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "verifyingContract",
				type: "address",
			},
			{
				internalType: "bytes32",
				name: "salt",
				type: "bytes32",
			},
			{
				internalType: "uint256[]",
				name: "extensions",
				type: "uint256[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "feeRecipient",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "freelancer",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_bountyId",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "_client",
				type: "address",
			},
			{
				internalType: "contract IERC20",
				name: "_token",
				type: "address",
			},
			{
				internalType: "uint128",
				name: "_reward",
				type: "uint128",
			},
			{
				internalType: "uint64",
				name: "_deadline",
				type: "uint64",
			},
		],
		name: "init",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "platformFeeBps",
		outputs: [
			{
				internalType: "uint16",
				name: "",
				type: "uint16",
			},
		],
		stateMutability: "view",
		type: "function",
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
