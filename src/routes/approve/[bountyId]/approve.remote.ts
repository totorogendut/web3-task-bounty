import { query } from "$app/server";
import { escrowStatusEnum, factoryContractAddress, type EscrowStatus } from "$lib/_eth-shared";
import { publicClient } from "$lib/contracts.svelte";
import { db } from "$lib/server/db";
import { bounty } from "$lib/server/db/schemas/tasks";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { parseAbiItem, type Hex } from "viem";
import { z } from "zod/v4";

export const changeEscrowStatus = query(
	z.object({
		id: z.string(),
		escrowStatus: z.custom<EscrowStatus>(),
	}),
	async ({ id, escrowStatus }) => {
		if (!escrowStatusEnum.includes(escrowStatus)) throw error(403, "Escrow status not valid");
		await db.update(bounty).set({ escrowStatus }).where(eq(bounty.id, id));
		return {
			success: true,
		};
	},
);

export const waitCreatingContract = query(
	z.object({
		id: z.string(),
		hash: z.custom<Hex>(),
	}),
	async ({ id, hash }) => {
		const tx = await publicClient.waitForTransactionReceipt({ hash });
		const logs = await publicClient.getLogs({
			address: factoryContractAddress,
			event: parseAbiItem(
				"event EscrowCreated(bytes32 indexed bountyId,address escrow,address client,address token,uint256 reward,uint64 deadline)",
			),
			fromBlock: tx.blockNumber,
			toBlock: tx.blockNumber,
		});

		console.log(logs);

		const escrowAddress = logs?.[0]?.args?.escrow as Hex;

		if (tx.status === "reverted") {
			changeEscrowStatus({ id, escrowStatus: "mint reverted" });
			console.log("Reverted");
			throw error(500, "Contract is reverted");
		}

		if (!escrowAddress) {
			changeEscrowStatus({ id, escrowStatus: "mint reverted" });
			console.log("No contractAddress");
			throw error(500, "Contract address is invalid");
		}

		await db
			.update(bounty)
			.set({ escrowAddress, escrowStatus: "bid open" })
			.where(eq(bounty.id, id));

		return {
			success: true,
		};
	},
);
