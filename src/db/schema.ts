import { pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core';
import { text, timestamp } from 'drizzle-orm/pg-core';

export const contentType = pgEnum('content_type', ['text', 'image', 'video']);

export const threads = pgTable('threads', {
    id: uuid().defaultRandom().primaryKey(),
    title: text('title').notNull(),
    userId: text('user_id').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const messages = pgTable('messages', {
    id: uuid().defaultRandom().primaryKey(),
    threadId: text('thread_id').notNull(),
    content: text('content').notNull(),
    contentType: contentType().notNull().default('text'),
    role: text('role').notNull(), // 'user' or 'assistant'
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const models = pgTable('models', {
    id: uuid().defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});
