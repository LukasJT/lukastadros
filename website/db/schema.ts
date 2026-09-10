import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const siteContent = sqliteTable('site_content', {id: integer('id').primaryKey(), document: text('document').notNull(), revision: integer('revision').notNull(), updatedAt:text('updated_at').notNull()});
export const media = sqliteTable('media', {id:text('id').primaryKey(), ownerId:text('owner_id').notNull(), contentType:text('content_type').notNull(), size:integer('size').notNull(), createdAt:text('created_at').notNull()});
