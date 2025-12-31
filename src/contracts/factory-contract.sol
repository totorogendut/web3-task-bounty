// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IEscrowInit {
	function init(
		uint256 taskId,
		address client,
		IERC20 token,
		uint128 reward,
		uint64 deadline
	) external;
}

contract FreelanceEscrowFactory {
	using SafeERC20 for IERC20;

	address public immutable implementation;
	uint256 public taskCount;

	event EscrowCreated(
		uint256 indexed taskId,
		address escrow,
		address client,
		address token,
		uint256 reward,
		uint64 deadline
	);

	constructor(address escrowImplementation) {
		implementation = escrowImplementation;
	}

	function createTask(
		IERC20 token,
		uint128 reward,
		uint64 deadline
	) external returns (address escrow) {
		require(reward > 0, "Zero reward");

		uint256 id = taskCount++;

		escrow = Clones.clone(implementation);

		IEscrowInit(escrow).init(id, msg.sender, token, reward, deadline);

		token.safeTransferFrom(msg.sender, escrow, reward);

		emit EscrowCreated(id, escrow, msg.sender, address(token), reward, deadline);
	}
}
