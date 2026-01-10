PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bounty` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`id_bytes_32` text NOT NULL,
	`title` text,
	`description` text,
	`content` text,
	`client_id` text NOT NULL,
	`winning_bid_id` text,
	`winnerId` text,
	`skills` text DEFAULT '[]',
	`escrow_address` text,
	`reward_amount` text DEFAULT '0.00' NOT NULL,
	`reward_currency` text DEFAULT 'mnee',
	`deadline` integer,
	`can_refund` integer DEFAULT false,
	`escrow_status` text DEFAULT 'approval pending',
	CONSTRAINT `fk_bounty_client_id_user_id_fk` FOREIGN KEY (`client_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_bounty_winnerId_user_id_fk` FOREIGN KEY (`winnerId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_bounty`(`id`, `created_at`, `updated_at`, `id_bytes_32`, `title`, `description`, `content`, `client_id`, `winning_bid_id`, `winnerId`, `skills`, `escrow_address`, `reward_amount`, `reward_currency`, `deadline`, `can_refund`, `escrow_status`) SELECT `id`, `created_at`, `updated_at`, `id_bytes_32`, `title`, `description`, `content`, `client_id`, `winning_bid_id`, `winnerId`, `skills`, `escrow_address`, `reward_amount`, `reward_currency`, `deadline`, `can_refund`, `escrow_status` FROM `bounty`;--> statement-breakpoint
DROP TABLE `bounty`;--> statement-breakpoint
ALTER TABLE `__new_bounty` RENAME TO `bounty`;--> statement-breakpoint
PRAGMA foreign_keys=ON;