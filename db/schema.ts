import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const aiRateLimits = sqliteTable(
  "ai_rate_limits",
  {
    bucket: text("bucket").notNull(),
    windowStart: integer("window_start").notNull(),
    requestCount: integer("request_count").notNull().default(0),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.bucket, table.windowStart] }),
  ],
);
