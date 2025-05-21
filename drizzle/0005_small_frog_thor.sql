PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stock_daily` (
	`id` text PRIMARY KEY NOT NULL,
	`stock_id` text NOT NULL,
	`trade_date` text NOT NULL,
	`close` real NOT NULL,
	`turnover_rate` real,
	`turnover_rate_f` real,
	`volume_ratio` real,
	`pe` real,
	`pe_ttm` real,
	`pb` real,
	`ps` real,
	`ps_ttm` real,
	`dv_ratio` real,
	`dv_ttm` real,
	`total_share` real,
	`float_share` real,
	`free_share` real,
	`total_mv` real,
	`circ_mv` real,
	`limit_status` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`stock_id`) REFERENCES `all_stock`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_stock_daily`("id", "stock_id", "trade_date", "close", "turnover_rate", "turnover_rate_f", "volume_ratio", "pe", "pe_ttm", "pb", "ps", "ps_ttm", "dv_ratio", "dv_ttm", "total_share", "float_share", "free_share", "total_mv", "circ_mv", "limit_status", "created_at", "updated_at") SELECT "id", "stock_id", "trade_date", "close", "turnover_rate", "turnover_rate_f", "volume_ratio", "pe", "pe_ttm", "pb", "ps", "ps_ttm", "dv_ratio", "dv_ttm", "total_share", "float_share", "free_share", "total_mv", "circ_mv", "limit_status", "created_at", "updated_at" FROM `stock_daily`;--> statement-breakpoint
DROP TABLE `stock_daily`;--> statement-breakpoint
ALTER TABLE `__new_stock_daily` RENAME TO `stock_daily`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_stock_price` (
	`id` text PRIMARY KEY NOT NULL,
	`stock_id` text NOT NULL,
	`trade_date` text NOT NULL,
	`open` real NOT NULL,
	`high` real NOT NULL,
	`low` real NOT NULL,
	`close` real NOT NULL,
	`pre_close` real NOT NULL,
	`change` real NOT NULL,
	`pct_change` real NOT NULL,
	`vol` real NOT NULL,
	`amount` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`stock_id`) REFERENCES `all_stock`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_stock_price`("id", "stock_id", "trade_date", "open", "high", "low", "close", "pre_close", "change", "pct_change", "vol", "amount", "created_at", "updated_at") SELECT "id", "stock_id", "trade_date", "open", "high", "low", "close", "pre_close", "change", "pct_change", "vol", "amount", "created_at", "updated_at" FROM `stock_price`;--> statement-breakpoint
DROP TABLE `stock_price`;--> statement-breakpoint
ALTER TABLE `__new_stock_price` RENAME TO `stock_price`;