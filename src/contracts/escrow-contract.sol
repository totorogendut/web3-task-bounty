// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title FreelanceEscrowEIP712
 * @notice An optimized escrow contract for freelance tasks.
 * @dev Optimized for gas and storage:
 * - Bit packed Task struct to fit in 2 slots (3 total with freelancer).
 * - Removed workUri from storage, only emitted in events.
 * - Used custom errors for gas-efficient reverts.
 * - Follows CEI pattern to remove ReentrancyGuard overhead.
 */
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

	struct Task {
		// Slot 1: 160 + 48 + 40 + 8 = 256 bits
		address client; // 160
		uint48 deadline; // 48
		uint40 taskId; // 40
		Status status; // 8
		// Slot 2: 160 + 96 = 256 bits
		IERC20 token; // 160
		uint96 reward; // 96
	}

	Task public task;
	address public freelancer; // Slot 3

	bytes32 private constant SUBMISSION_TYPEHASH =
		keccak256("Submission(uint256 taskId,address freelancer,string workUri,uint256 nonce)");

	mapping(address => uint256) public nonces;

	/* ================= EVENTS ================= */

	event TaskAwarded(address indexed freelancer, string workUri);
	event PaymentReleased(address indexed freelancer, uint256 payout);
	event TaskRefunded(address indexed client);

	/* ================= CONSTRUCTOR ================= */

	constructor(uint16 feeBps, address feeAddr) EIP712("FreelanceEscrow", "1") {
		platformFeeBps = feeBps;
		feeRecipient = feeAddr;
	}

	/* ================= INITIALIZER ================= */

	/// called once by factory
	function init(
		uint256 _taskId,
		address _client,
		IERC20 _token,
		uint128 _reward,
		uint64 _deadline
	) external {
		if (task.client != address(0)) revert AlreadyInitialized();
		if (_deadline <= block.timestamp) revert InvalidDeadline();

		task = Task({
			client: _client,
			deadline: uint48(_deadline),
			taskId: uint40(_taskId),
			status: Status.Open,
			token: _token,
			reward: uint96(_reward)
		});
	}

	/* ================= CORE ================= */

	/// Client selects winner using signed submission
	function awardSubmission(
		address _freelancer,
		string calldata workUri,
		bytes calldata signature
	) external {
		Task storage t = task;

		if (msg.sender != t.client) revert NotClient();
		if (t.status != Status.Open) revert NotOpen();
		if (block.timestamp > t.deadline) revert DeadlinePassed();

		bytes32 digest = _hashTypedDataV4(
			keccak256(
				abi.encode(
					SUBMISSION_TYPEHASH,
					uint256(t.taskId),
					_freelancer,
					keccak256(bytes(workUri)),
					nonces[_freelancer]++
				)
			)
		);

		address signer = ECDSA.recover(digest, signature);
		if (signer != _freelancer) revert InvalidSignature();

		t.status = Status.Awarded;
		freelancer = _freelancer;

		emit TaskAwarded(_freelancer, workUri);
	}

	function releasePayment() external {
		Task storage t = task;
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
		Task storage t = task;
		if (t.status != Status.Open) revert NotOpen();
		if (block.timestamp <= t.deadline) revert TooEarly();

		// Effects
		t.status = Status.Refunded;
		address client = t.client;
		uint256 reward = uint256(t.reward);
		IERC20 token = t.token;

		// Interactions
		token.safeTransfer(client, reward);

		emit TaskRefunded(client);
	}
}
