import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const initRecord = sqliteTable("init_record", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const allStock = sqliteTable("all_stock", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  ts_code: text("ts_code").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  area: text("area"),
  industry: text("industry"),
  fullname: text("fullname"),
  enname: text("enname"),
  cnspell: text("cnspell"),
  market: text("market"),
  exchange: text("exchange"),
  curr_type: text("curr_type"),
  list_status: text("list_status"),
  list_date: text("list_date"),
  delist_date: text("delist_date"),
  is_hs: text("is_hs"),
  act_name: text("act_name"),
  act_ent_type: text("act_ent_type"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const stock = sqliteTable("stock", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stockId: text("stock_id")
    .notNull()
    .references(() => allStock.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const stockPrice = sqliteTable("stock_price", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  stockId: text("stock_id")
    .notNull()
    .references(() => stock.id, { onDelete: "cascade" }),
  trade_date: text("trade_date").notNull(),
  open: real("open").notNull(),
  high: real("high").notNull(),
  low: real("low").notNull(),
  close: real("close").notNull(),
  pre_close: real("pre_close").notNull(),
  change: real("change").notNull(),
  pct_change: real("pct_change").notNull(),
  vol: real("vol").notNull(),
  amount: real("amount").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const stockDaily = sqliteTable("stock_daily", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  stockId: text("stock_id")
    .notNull()
    .references(() => stock.id, { onDelete: "cascade" }),
  trade_date: text("trade_date").notNull(),
  close: real("close").notNull(),
  turnover_rate: real("turnover_rate").notNull(),
  turnover_rate_f: real("turnover_rate_f").notNull(),
  volume_ratio: real("volume_ratio").notNull(),
  pe: real("pe").notNull(),
  pe_ttm: real("pe_ttm").notNull(),
  pb: real("pb").notNull(),
  ps: real("ps").notNull(),
  ps_ttm: real("ps_ttm").notNull(),
  dv_ratio: real("dv_ratio").notNull(),
  dv_ttm: real("dv_ttm").notNull(),
  total_share: real("total_share").notNull(),
  float_share: real("float_share").notNull(),
  free_share: real("free_share").notNull(),
  total_mv: real("total_mv").notNull(),
  circ_mv: real("circ_mv").notNull(),
  limit_status: text("limit_status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});
