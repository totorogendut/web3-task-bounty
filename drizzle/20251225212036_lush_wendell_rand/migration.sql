CREATE TABLE `pending_payment` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	`task_id` text NOT NULL,
	`bounty_id` text NOT NULL,
	`reward` integer NOT NULL,
	CONSTRAINT `fk_pending_payment_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_pending_payment_task_id_task_id_fk` FOREIGN KEY (`task_id`) REFERENCES `task`(`id`),
	CONSTRAINT `fk_pending_payment_bounty_id_task_id_fk` FOREIGN KEY (`bounty_id`) REFERENCES `task`(`id`)
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`address` text NOT NULL,
	`ticket_id` text,
	`rawtx` text,
	`state` text DEFAULT 'pending',
	`currency` text DEFAULT 'mnee',
	CONSTRAINT `fk_transaction_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `bounty` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`title` text,
	`description` text,
	`project_id` text NOT NULL,
	`reward` integer,
	`is_claimed` integer DEFAULT 0,
	`managers` text DEFAULT '[]',
	CONSTRAINT `fk_bounty_project_id_project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`)
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`content` text,
	`commentable_type` text DEFAULT 'task',
	`commentable_id` text,
	`userId` text NOT NULL,
	CONSTRAINT `fk_comment_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`owner_id` text NOT NULL,
	`managers_id` text NOT NULL,
	`title` text,
	`description` text,
	CONSTRAINT `fk_project_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_project_managers_id_user_id_fk` FOREIGN KEY (`managers_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `task` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	`bounty_id` text NOT NULL,
	`content` text NOT NULL,
	`title` text NOT NULL,
	`submission` text,
	`state` text DEFAULT 'in_progress',
	CONSTRAINT `fk_task_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_task_bounty_id_bounty_id_fk` FOREIGN KEY (`bounty_id`) REFERENCES `bounty`(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`age` integer,
	`username` text NOT NULL UNIQUE,
	`password_hash` text NOT NULL,
	`avatar` text,
	`email` text
);
