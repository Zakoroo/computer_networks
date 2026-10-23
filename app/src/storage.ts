import { openDB, type DBSchema } from 'idb';
import { z } from 'zod';
import { emptyProfile, exactAnswer } from './model';
import type { Backup, Profile } from './types';

const identity = z.string().regex(/^[a-z]+(?:-[a-z]+)*-(?:q)?\d+$/);
const recordId = z.string().regex(/^(?:lesson|question):[a-z]+(?:-[a-z]+)*-(?:q)?\d+$/);
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

export const profileSchema = z.object({
  schema_version: z.literal(1),
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
}).strict().refine(profile => new Set(profile.attempts.map(attempt => attempt.id)).size === profile.attempts.length,
  'Duplicate attempt identities');

const backupSchema = z.object({
  format: z.literal('network-study-backup'), schema_version: z.literal(1),
  exported_at: timestamp, content_version: hash, profile: profileSchema,
}).strict();

export function parseBackup(text: string): Backup {
  if (text.length > 20_000_000) throw new Error('The backup is too large (maximum 20 MB).');
  try { return backupSchema.parse(JSON.parse(text)); }
  catch { throw new Error('This file is not a valid Network Study version 1 backup. Your current data is unchanged.'); }
}

export function makeBackup(profile: Profile, contentVersion: string): Backup {
  return { format: 'network-study-backup', schema_version: 1, exported_at: new Date().toISOString(),
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
      return saved ? profileSchema.parse(saved) : emptyProfile();
    },
    async change(update: (profile: Profile) => Profile): Promise<Profile> {
      const database = await db;
      const transaction = database.transaction('profile', 'readwrite');
      try {
        const current = await transaction.store.get('personal') ?? emptyProfile();
        const next = profileSchema.parse(update(profileSchema.parse(current)));
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
