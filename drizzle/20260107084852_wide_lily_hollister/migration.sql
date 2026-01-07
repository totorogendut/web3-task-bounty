ALTER TABLE `bounty` RENAME COLUMN `escrow_contract_address` TO `escrow_address`;--> statement-breakpoint
ALTER TABLE `bounty` ADD `escrow_bounty_id` integer;--> statement-breakpoint
ALTER TABLE `bounty` DROP COLUMN `factory_contract_address`;