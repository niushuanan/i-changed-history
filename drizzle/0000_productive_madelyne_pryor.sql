CREATE TABLE `ai_rate_limits` (
	`bucket` text NOT NULL,
	`window_start` integer NOT NULL,
	`request_count` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`bucket`, `window_start`)
);
