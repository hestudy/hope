import { relations } from "drizzle-orm";
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

export const stock_basic = sqliteTable("stock_basic", {
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

export const stock_basic_relations = relations(stock_basic, ({ many }) => {
  return {
    daily_basic: many(daily_basic),
    daily: many(daily),
  };
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
    .references(() => stock_basic.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const stockRelations = relations(stock, ({ one }) => {
  return {
    stock: one(stock_basic, {
      fields: [stock.stockId],
      references: [stock_basic.id],
    }),
  };
});

export const daily = sqliteTable("daily", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  stockId: text("stock_id")
    .notNull()
    .references(() => stock_basic.id, { onDelete: "cascade" }),
  trade_date: text("trade_date").notNull(),
  open: real("open").notNull(),
  high: real("high").notNull(),
  low: real("low").notNull(),
  close: real("close").notNull(),
  pre_close: real("pre_close"),
  change: real("change"),
  pct_change: real("pct_change"),
  vol: real("vol"),
  amount: real("amount"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const daily_relations = relations(daily, ({ one }) => {
  return {
    stock: one(stock_basic, {
      fields: [daily.stockId],
      references: [stock_basic.id],
    }),
  };
});

export const daily_basic = sqliteTable("daily_basic", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  stockId: text("stock_id")
    .notNull()
    .references(() => stock_basic.id, { onDelete: "cascade" }),
  trade_date: text("trade_date").notNull(),
  close: real("close").notNull(),
  turnover_rate: real("turnover_rate"),
  turnover_rate_f: real("turnover_rate_f"),
  volume_ratio: real("volume_ratio"),
  pe: real("pe"),
  pe_ttm: real("pe_ttm"),
  pb: real("pb"),
  ps: real("ps"),
  ps_ttm: real("ps_ttm"),
  dv_ratio: real("dv_ratio"),
  dv_ttm: real("dv_ttm"),
  total_share: real("total_share"),
  float_share: real("float_share"),
  free_share: real("free_share"),
  total_mv: real("total_mv"),
  circ_mv: real("circ_mv"),
  limit_status: text("limit_status"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const daily_basic_relations = relations(daily_basic, ({ one }) => {
  return {
    stock: one(stock_basic, {
      fields: [daily_basic.stockId],
      references: [stock_basic.id],
    }),
  };
});
