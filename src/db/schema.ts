import { relations } from "drizzle-orm";
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").unique(),
  hash: text("password").notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  messages: many(messages)
}))

export const messages = pgTable('message', {
  id: serial("id").primaryKey(),
  text: text("message"),
  filePath: text("file_path"),
  userId: integer("user_id").notNull().references(() => users.id),
  timeStamp: timestamp("time", { precision: 3 }).defaultNow()
})

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id]
  })
}))