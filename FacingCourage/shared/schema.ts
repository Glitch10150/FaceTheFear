import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  discord: text("discord").notNull(),
  experience: text("experience").notNull(),
  role: text("role").notNull(),
  availability: text("availability").notNull(), // JSON string of selected days
  motivation: text("motivation").notNull(),
  whyAcceptYou: text("why_accept_you").notNull(),
  previousGroups: text("previous_groups"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewedBy: text("reviewed_by"), // admin username who made the decision
  reviewedAt: timestamp("reviewed_at"), // when the status was changed
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // hashed password
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  submittedAt: true,
}).extend({
  availability: z.array(z.string()).min(1, "Please select at least one availability option"),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
