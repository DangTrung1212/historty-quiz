import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const quizSections = pgTable("quiz_sections", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  questions: jsonb("questions").notNull(),
  order: integer("order").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sectionId: integer("section_id").notNull().references(() => quizSections.id),
  completed: boolean("completed").notNull().default(false),
  score: integer("score").notNull().default(0),
  answers: jsonb("answers"),
  completedAt: text("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizSectionSchema = createInsertSchema(quizSections).pick({
  title: true,
  questions: true,
  order: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  sectionId: true,
  completed: true,
  score: true,
  answers: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuizSection = z.infer<typeof insertQuizSectionSchema>;
export type QuizSection = typeof quizSections.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
