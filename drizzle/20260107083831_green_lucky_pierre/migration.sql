ALTER TABLE `bid` ADD `submittedAt` integer;--> statement-breakpoint
ALTER TABLE `bid` ADD `signature` text;--> statement-breakpoint
ALTER TABLE `bid` DROP COLUMN `submission`;