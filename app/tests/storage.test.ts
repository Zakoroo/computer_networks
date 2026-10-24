import 'fake-indexeddb/auto';
import { readFileSync } from 'node:fs';
import { openDB } from 'idb';
import { describe, expect, it } from 'vitest';
import { backupSummary, blankAnnotation, createAttempt, emptyProfile } from '../src/model';
import { createStore, makeBackup, parseBackup, profileSchema } from '../src/storage';
import type { Catalogue, Comment } from '../src/types';

const catalogue = JSON.parse(readFileSync('public/content/catalogue.json', 'utf8')) as Catalogue;
const savedComment = (text = 'This needs another example.'): Comment => ({
  id: crypto.randomUUID(), text, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
});

describe('personal data durability and restore boundaries', () => {
  it('persists every catalogue identity, including IPv6, across reopen and backup restore', async () => {
    const profile = emptyProfile();
    const read_at = new Date().toISOString();
    for (const lesson of catalogue.lessons) {
      profile.lessons[lesson.id] = { read_at, scroll: .4 };
      profile.annotations[`lesson:${lesson.id}`] = { ...blankAnnotation(), priority: 'high' };
    }
    for (const question of catalogue.questions) {
      profile.annotations[`question:${question.question_id}`] = { ...blankAnnotation(), added_tags: ['revision'] };
      profile.attempts.push(createAttempt(question, question.correct_answers));
    }
    profile.last_lesson_id = 'ipv6-17';
    profile.current_route = '/lesson/ipv6-17';
    expect(profileSchema.safeParse(profile).success).toBe(true);
    const name = crypto.randomUUID();
    const first = createStore(name);
    await first.change(() => profile);
    await first.close();
    const reopened = createStore(name);
    try {
      expect(await reopened.read()).toEqual(profile);
      const backup = parseBackup(JSON.stringify(makeBackup(await reopened.read(), catalogue.content_version)));
      expect(backup.profile).toEqual(profile);
      expect(await reopened.change(() => backup.profile)).toEqual(profile);
    } finally { await reopened.close(); }
  });

  it('round-trips read marks, labels, criteria, route, and attempts through storage and a backup', async () => {
    const store = createStore(crypto.randomUUID());
    const profile = emptyProfile();
    profile.lessons['dns-01'] = { read_at: new Date().toISOString(), scroll: .4 };
    profile.annotations['question:dns-q001'] = { ...blankAnnotation(), added_tags: ['revision'], added_flags: ['revisit'] };
    profile.attempts.push(createAttempt(catalogue.questions.find(q => q.question_id === 'dns-q001')!, [4]));
    profile.current_route = '/lesson/dns-01';
    profile.criteria.include_tags = ['revision'];
    profile.comments['lesson:dns-01'] = [savedComment()];
    profile.comments['question:dns-q001'] = [savedComment('Why is this answer correct?')];
    await store.change(() => profile);
    const backup = parseBackup(JSON.stringify(makeBackup(await store.read(), catalogue.content_version)));
    expect(backup.profile).toEqual(profile);
    await store.close();
  });
  it('migrates version 1 stored progress and backups without losing existing records', async () => {
    const profile = emptyProfile();
    profile.lessons['dns-01'] = { read_at: new Date().toISOString(), scroll: .75 };
    profile.annotations['question:dns-q001'] = { ...blankAnnotation(), added_tags: ['exam'], priority: 'high' };
    profile.attempts = [createAttempt(catalogue.questions[0], [0])];
    profile.criteria.search = 'routing';
    profile.last_lesson_id = 'dns-01';
    profile.current_route = '/lesson/dns-01';
    const legacy = JSON.parse(JSON.stringify(profile));
    legacy.schema_version = 1;
    delete legacy.comments;
    const name = crypto.randomUUID();
    const store = createStore(name);
    await store.read();
    const database = await openDB(name, 1);
    await database.put('profile', legacy, 'personal');
    database.close();
    try {
      expect(await store.read()).toEqual(profile);
      const backup = { format: 'network-study-backup', schema_version: 1, exported_at: new Date().toISOString(),
        content_version: catalogue.content_version, profile: legacy };
      expect(parseBackup(JSON.stringify(backup)).profile).toEqual(profile);
      delete legacy.last_lesson_id;
      expect(parseBackup(JSON.stringify(backup)).profile.last_lesson_id).toBeNull();
      const added = savedComment();
      await store.change(current => ({ ...current, comments: { 'lesson:dns-01': [added] } }));
      expect(await store.read()).toEqual({ ...profile, comments: { 'lesson:dns-01': [added] } });
      expect(makeBackup(await store.read(), catalogue.content_version).schema_version).toBe(2);
    } finally { await store.close(); }
  });
  it('keeps current data after invalid restore or failed transactional validation', async () => {
    const store = createStore(crypto.randomUUID());
    const before = await store.change(profile => ({ ...profile, current_route: '/lesson/tcp-06' }));
    expect(() => parseBackup('{bad')).toThrow('not a valid');
    const backup = makeBackup(before, catalogue.content_version);
    expect(() => parseBackup(JSON.stringify({ ...backup, schema_version: 3 }))).toThrow();
    await expect(store.change(profile => ({ ...profile, schema_version: 3 as 2 }))).rejects.toThrow();
    expect(await store.read()).toEqual(before);
    await store.close();
  });
  it('serializes concurrent tab changes without losing unrelated saved records', async () => {
    const name = crypto.randomUUID();
    const first = createStore(name), second = createStore(name);
    await Promise.all([
      first.change(profile => ({ ...profile, lessons: { ...profile.lessons, 'dns-01': { read_at: new Date().toISOString(), scroll: 0 } } })),
      second.change(profile => ({ ...profile, lessons: { ...profile.lessons, 'tcp-01': { read_at: null, scroll: .2 } } })),
    ]);
    expect(Object.keys((await first.read()).lessons).sort()).toEqual(['dns-01', 'tcp-01']);
    await first.close(); await second.close();
  });
  it('keeps simultaneous comments and annotations from separate tabs', async () => {
    const name = crypto.randomUUID();
    const first = createStore(name), second = createStore(name);
    const one = savedComment('First tab'), two = savedComment('Second tab');
    try {
      await Promise.all([
        first.change(profile => ({ ...profile, comments: { ...profile.comments,
          'lesson:ipv6-17': [...(profile.comments['lesson:ipv6-17'] ?? []), one] } })),
        second.change(profile => ({ ...profile, comments: { ...profile.comments,
          'lesson:ipv6-17': [...(profile.comments['lesson:ipv6-17'] ?? []), two] },
          annotations: { ...profile.annotations, 'question:ipv6-q012': blankAnnotation() } })),
      ]);
      const profile = await first.read();
      expect(profile.comments['lesson:ipv6-17']).toHaveLength(2);
      expect(profile.comments['lesson:ipv6-17'].map(comment => comment.text).sort()).toEqual(['First tab', 'Second tab']);
      expect(profile.annotations['question:ipv6-q012']).toBeDefined();
    } finally { await first.close(); await second.close(); }
  });
  it('preserves unmatched history and reports it before replacement', () => {
    const profile = emptyProfile();
    profile.lessons['future-01'] = { read_at: null, scroll: 0 };
    profile.annotations['question:future-q001'] = blankAnnotation();
    profile.comments['question:future-q001'] = [savedComment()];
    profile.attempts.push({ ...createAttempt(catalogue.questions[0], [0]), answer_version: 'e'.repeat(64) });
    const parsed = parseBackup(JSON.stringify(makeBackup(profile, catalogue.content_version)));
    const summary = backupSummary(parsed.profile, catalogue);
    expect(summary.unmatchedLessons).toEqual(['future-01']);
    expect(summary.unmatchedAnnotations).toEqual(['question:future-q001']);
    expect(summary.unmatchedComments).toEqual(['question:future-q001']);
    expect(summary.commentCount).toBe(1);
    expect(summary.historicalAttempts).toHaveLength(1);
    expect(parsed.profile).toEqual(profile);
  });
  it('rejects invalid indices and inconsistent results without trusting an imported score', () => {
    const profile = emptyProfile();
    profile.attempts.push(createAttempt(catalogue.questions[0], [0]));
    const backup = makeBackup(profile, catalogue.content_version);
    backup.profile.attempts[0].selected = [999];
    expect(() => parseBackup(JSON.stringify(backup))).toThrow();
  });
  it.each([
    { text: '' }, { text: '   ' }, { text: 'x'.repeat(5001) }, { id: 'not-a-uuid' }, { created_at: 'not-a-date' },
  ])('rejects malformed imported comments: %j', change => {
    const profile = emptyProfile();
    profile.comments['lesson:dns-01'] = [savedComment()];
    const backup = makeBackup(profile, catalogue.content_version);
    Object.assign(backup.profile.comments['lesson:dns-01'][0], change);
    expect(() => parseBackup(JSON.stringify(backup))).toThrow('not a valid');
  });
  it('rejects duplicate comment IDs without changing existing saved comments', async () => {
    const store = createStore(crypto.randomUUID());
    const comment = savedComment();
    try {
      const before = await store.change(profile => ({ ...profile, comments: { 'lesson:dns-01': [comment] } }));
      await expect(store.change(profile => ({ ...profile, comments: { 'lesson:dns-01': [comment, comment] } }))).rejects.toThrow();
      expect(await store.read()).toEqual(before);
    } finally { await store.close(); }
  });
});
