CREATE TABLE `keyval` (
	`key` text PRIMARY KEY,
	`values` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	`amount` text DEFAULT '0.00' NOT NULL,
	`address` text NOT NULL,
	`tx_hash` text,
	`bid_id` text NOT NULL,
	`bounty_id` text NOT NULL,
	`state` text DEFAULT 'pending',
	`message` text,
	`currency` text DEFAULT 'mnee',
	CONSTRAINT `fk_transaction_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_transaction_bid_id_bid_id_fk` FOREIGN KEY (`bid_id`) REFERENCES `bid`(`id`),
	CONSTRAINT `fk_transaction_bounty_id_bid_id_fk` FOREIGN KEY (`bounty_id`) REFERENCES `bid`(`id`)
);
--> statement-breakpoint
CREATE TABLE `bid` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	`bounty_id` text NOT NULL,
	`content` text NOT NULL,
	`submission` text,
	`state` text DEFAULT 'in_progress',
	CONSTRAINT `fk_bid_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_bid_bounty_id_bounty_id_fk` FOREIGN KEY (`bounty_id`) REFERENCES `bounty`(`id`)
);
--> statement-breakpoint
CREATE TABLE `bounty` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`title` text,
	`description` text,
	`content` text,
	`client_id` text NOT NULL,
	`skills` text DEFAULT '[]',
	`escrow_contract_address` text,
	`factory_contract_address` text,
	`reward_amount` text DEFAULT '0.00' NOT NULL,
	`is_claimed` integer DEFAULT false,
	`deadline` integer,
	`can_refund` integer DEFAULT true,
	CONSTRAINT `fk_bounty_client_id_user_id_fk` FOREIGN KEY (`client_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`content` text,
	`commentable_type` text DEFAULT 'bid',
	`commentable_id` text,
	`userId` text NOT NULL,
	CONSTRAINT `fk_comment_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`content` text,
	`commentable_id` text,
	`userId` text NOT NULL,
	`bid_id` text NOT NULL,
	`attachments` text,
	CONSTRAINT `fk_progress_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_progress_bid_id_bid_id_fk` FOREIGN KEY (`bid_id`) REFERENCES `bid`(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`username` text UNIQUE,
	`wallet_address` text,
	`avatar` text,
	`skills` text DEFAULT '[]',
	`email` text,
	`nonce` text,
	`last_login_at` integer
);
