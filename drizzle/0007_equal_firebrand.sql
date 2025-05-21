PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily` (
	`id` text PRIMARY KEY NOT NULL,
	`stock_id` text NOT NULL,
	`trade_date` text NOT NULL,
	`open` real NOT NULL,
	`high` real NOT NULL,
	`low` real NOT NULL,
	`close` real NOT NULL,
	`pre_close` real,
	`change` real,
	`pct_change` real,
	`vol` real,
	`amount` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`stock_id`) REFERENCES `stock_basic`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_daily`("id", "stock_id", "trade_date", "open", "high", "low", "close", "pre_close", "change", "pct_change", "vol", "amount", "created_at", "updated_at") SELECT "id", "stock_id", "trade_date", "open", "high", "low", "close", "pre_close", "change", "pct_change", "vol", "amount", "created_at", "updated_at" FROM `daily`;--> statement-breakpoint
DROP TABLE `daily`;--> statement-breakpoint
ALTER TABLE `__new_daily` RENAME TO `daily`;--> statement-breakpoint
PRAGMA foreign_keys=ON;