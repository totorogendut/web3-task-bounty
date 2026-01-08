// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract FreelanceEscrowEIP712 is EIP712 {
	using SafeERC20 for IERC20;

	/* ================= ERRORS ================= */

	error AlreadyInitialized();
	error InvalidDeadline();
	error NotClient();
	error NotOpen();
	error DeadlinePassed();
	error InvalidSignature();
	error NotAwarded();
	error TooEarly();

	/* ================= CONFIG ================= */

	uint16 public immutable platformFeeBps;
	address public immutable feeRecipient;

	/* ================= TYPES ================= */

	enum Status {
		Open,
		Awarded,
		Completed,
		Refunded
	}

	struct Bounty {
		address client;
		uint48 deadline;
		bytes32 bountyId;
		Status status;
		IERC20 token;
		uint96 reward;
	}

	Bounty public bounty;
	address public freelancer;
	bytes32 private constant SUBMISSION_TYPEHASH =
		keccak256(
			"Submission(bytes32 bountyId,address freelancer,uint256 submittedAt,uint256 nonce)"
		);

	mapping(address => uint256) public nonces;

	/* ================= EVENTS ================= */

	event BountyAwarded(address indexed freelancer);
	event PaymentReleased(address indexed freelancer, uint256 payout);
	event BountyRefunded(address indexed client);

	/* ================= CONSTRUCTOR ================= */

	constructor(uint16 feeBps, address feeAddr) EIP712("FreelanceEscrow", "1") {
		require(feeBps <= 10_000, "Fee too high");
		require(feeAddr != address(0), "Invalid fee recipient");
		platformFeeBps = feeBps;
		feeRecipient = feeAddr;
	}

	/* ================= INITIALIZER ================= */

	/// called once by factory
	function init(
		bytes32 _bountyId,
		address _client,
		IERC20 _token,
		uint128 _reward,
		uint64 _deadline
	) external {
		if (bounty.client != address(0)) revert AlreadyInitialized();
		if (_deadline <= block.timestamp) revert InvalidDeadline();

		bounty = Bounty({
			client: _client,
			deadline: uint48(_deadline),
			bountyId: bytes32(_bountyId),
			status: Status.Open,
			token: _token,
			reward: uint96(_reward)
		});
	}

	/* ================= CORE ================= */

	/// Client selects winner using signed submission
	function awardSubmission(
		address _freelancer,
		uint256 submittedAt,
		bytes calldata signature
	) external {
		Bounty storage t = bounty;

		if (msg.sender != t.client) revert NotClient();
		if (t.status != Status.Open) revert NotOpen();
		if (submittedAt > t.deadline) revert DeadlinePassed();
		if (submittedAt > block.timestamp + 5 minutes) revert InvalidSignature();

		bytes32 digest = _hashTypedDataV4(
			keccak256(abi.encode(SUBMISSION_TYPEHASH, t.bountyId, _freelancer, nonces[_freelancer]))
		);

		address signer = ECDSA.recover(digest, signature);
		if (signer != _freelancer) revert InvalidSignature();
		nonces[_freelancer]++;

		t.status = Status.Awarded;
		freelancer = _freelancer;

		emit BountyAwarded(_freelancer);
	}

	function releasePayment() external {
		Bounty storage t = bounty;
		if (t.status != Status.Awarded) revert NotAwarded();

		// Effects
		t.status = Status.Completed;
		address _freelancer = freelancer;
		uint256 totalReward = uint256(t.reward);
		IERC20 token = t.token;

		// Interactions
		uint256 fee;
		unchecked {
			fee = (totalReward * uint256(platformFeeBps)) / 10_000;
		}
		uint256 payout = totalReward - fee;

		if (fee > 0) {
			token.safeTransfer(feeRecipient, fee);
		}

		token.safeTransfer(_freelancer, payout);

		emit PaymentReleased(_freelancer, payout);
	}

	/// Anyone can trigger refund after deadline
	function autoRefund() external {
		Bounty storage t = bounty;
		if (t.status != Status.Open) revert NotOpen();
		if (block.timestamp <= t.deadline) revert TooEarly();

		// Effects
		t.status = Status.Refunded;
		address client = t.client;
		uint256 reward = uint256(t.reward);
		IERC20 token = t.token;

		// Interactions
		token.safeTransfer(client, reward);

		emit BountyRefunded(client);
	}
}
