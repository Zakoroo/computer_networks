import { openDB, type DBSchema } from 'idb';
import { z } from 'zod';
import { emptyProfile, exactAnswer } from './model';
import type { Backup, Profile } from './types';

const identity = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*-(?:q)?\d+$/);
const recordId = z.string().regex(/^(?:lesson|question):[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*-(?:q)?\d+$/);
const timestamp = z.string().datetime();
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const strings = z.array(z.string().min(1).max(100)).max(1000);
const indices = z.array(z.number().int().nonnegative()).min(1).max(100);
const criteriaSchema = z.object({
  topics: strings, include_tags: strings, exclude_tags: strings, include_flags: strings, exclude_flags: strings,
  coverage: z.enum(['linked', 'unlinked', 'all']), attempted: z.enum(['all', 'new', 'attempted', 'incorrect']),
  read: z.enum(['all', 'read', 'unread']), include_deferred: z.boolean(),
  practice: z.enum(['scored', 'review']), search: z.string().max(1000),
}).strict();

const profileFields = {
  lessons: z.record(identity, z.object({ read_at: timestamp.nullable(), scroll: z.number().finite().min(0).max(1) }).strict()),
  annotations: z.record(recordId, z.object({
    added_tags: strings, removed_tags: strings, added_flags: strings, removed_flags: strings,
    priority: z.enum(['high', 'normal', 'low']), deferred: z.boolean(), updated_at: timestamp,
  }).strict()),
  attempts: z.array(z.object({
    id: z.string().uuid(), question_id: identity, question_sha256: hash, answer_version: hash,
    selected: indices, correct_answers: indices, option_count: z.number().int().min(1).max(100),
    mode: z.enum(['scored', 'review']), correct: z.boolean(), created_at: timestamp,
  }).strict().refine(attempt =>
    [attempt.selected, attempt.correct_answers].every(values => new Set(values).size === values.length
      && values.every(index => index < attempt.option_count))
    && attempt.correct === exactAnswer(attempt.selected, attempt.correct_answers), 'Invalid attempt data')).max(100_000),
  criteria: criteriaSchema,
  current_route: z.string().regex(/^\/(?:roadmap|library|lesson\/[^\s]+|question\/[^\s]+|doc\/[^\s]+)$/).max(2000),
  last_lesson_id: identity.nullable().default(null),
};
const commentSchema = z.object({
  id: z.string().uuid(), text: z.string().trim().min(1).max(5000),
  created_at: timestamp, updated_at: timestamp,
}).strict();
const commentListSchema = z.array(commentSchema).max(1000).refine(comments =>
  new Set(comments.map(comment => comment.id)).size === comments.length, 'Duplicate comment identities');
export const profileSchema = z.object({
  schema_version: z.literal(2), ...profileFields, comments: z.record(recordId, commentListSchema),
}).strict().refine(profile => new Set(profile.attempts.map(attempt => attempt.id)).size === profile.attempts.length,
  'Duplicate attempt identities');
const legacyProfileSchema = z.object({ schema_version: z.literal(1), ...profileFields }).strict()
  .refine(profile => new Set(profile.attempts.map(attempt => attempt.id)).size === profile.attempts.length,
  'Duplicate attempt identities');

const backupSchema = z.object({
  format: z.literal('network-study-backup'), schema_version: z.literal(2),
  exported_at: timestamp, content_version: hash, profile: profileSchema,
}).strict();
const legacyBackupSchema = z.object({
  format: z.literal('network-study-backup'), schema_version: z.literal(1),
  exported_at: timestamp, content_version: hash, profile: legacyProfileSchema,
}).strict();

function parseStoredProfile(value: unknown): Profile {
  if (value && typeof value === 'object' && 'schema_version' in value && value.schema_version === 1) {
    return { ...legacyProfileSchema.parse(value), schema_version: 2, comments: {} };
  }
  return profileSchema.parse(value);
}

export function parseBackup(text: string): Backup {
  if (text.length > 20_000_000) throw new Error('The backup is too large (maximum 20 MB).');
  try {
    const value: unknown = JSON.parse(text);
    if (value && typeof value === 'object' && 'schema_version' in value && value.schema_version === 1) {
      const backup = legacyBackupSchema.parse(value);
      return { ...backup, schema_version: 2, profile: parseStoredProfile(backup.profile) };
    }
    return backupSchema.parse(value);
  } catch { throw new Error('This file is not a valid Network Study backup (supported versions: 1 and 2). Your current data is unchanged.'); }
}

export function makeBackup(profile: Profile, contentVersion: string): Backup {
  return { format: 'network-study-backup', schema_version: 2, exported_at: new Date().toISOString(),
    content_version: contentVersion, profile: profileSchema.parse(profile) };
}

interface StudyDB extends DBSchema {
  profile: { key: string; value: Profile };
}

export function createStore(name = 'network-study-v1') {
  const db = openDB<StudyDB>(name, 1, { upgrade(database) { database.createObjectStore('profile'); } });
  return {
    async read(): Promise<Profile> {
      const saved = await (await db).get('profile', 'personal');
      return saved ? parseStoredProfile(saved) : emptyProfile();
    },
    async change(update: (profile: Profile) => Profile): Promise<Profile> {
      const database = await db;
      const transaction = database.transaction('profile', 'readwrite');
      try {
        const current = await transaction.store.get('personal') ?? emptyProfile();
        const next = profileSchema.parse(update(parseStoredProfile(current)));
        await transaction.store.put(next, 'personal');
        await transaction.done;
        return next;
      } catch (error) {
        transaction.abort();
        await transaction.done.catch(() => {});
        throw error;
      }
    },
    async close() { (await db).close(); },
  };
}
