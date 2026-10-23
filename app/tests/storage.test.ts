import 'fake-indexeddb/auto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { backupSummary, blankAnnotation, createAttempt, emptyProfile } from '../src/model';
import { createStore, makeBackup, parseBackup } from '../src/storage';
import type { Catalogue } from '../src/types';

const catalogue = JSON.parse(readFileSync('public/content/catalogue.json', 'utf8')) as Catalogue;

describe('personal data durability and restore boundaries', () => {
  it('round-trips read marks, labels, criteria, route, and attempts through storage and a backup', async () => {
    const store = createStore(crypto.randomUUID());
    const profile = emptyProfile();
    profile.lessons['dns-01'] = { read_at: new Date().toISOString(), scroll: .4 };
    profile.annotations['question:dns-q001'] = { ...blankAnnotation(), added_tags: ['revision'], added_flags: ['revisit'] };
    profile.attempts.push(createAttempt(catalogue.questions.find(q => q.question_id === 'dns-q001')!, [4]));
    profile.current_route = '/lesson/dns-01';
    profile.criteria.include_tags = ['revision'];
    await store.change(() => profile);
    const backup = parseBackup(JSON.stringify(makeBackup(await store.read(), catalogue.content_version)));
    expect(backup.profile).toEqual(profile);
    await store.close();
  });
  it('keeps current data after invalid restore or failed transactional validation', async () => {
    const store = createStore(crypto.randomUUID());
    const before = await store.change(profile => ({ ...profile, current_route: '/lesson/tcp-06' }));
    expect(() => parseBackup('{bad')).toThrow('not a valid');
    const backup = makeBackup(before, catalogue.content_version);
    expect(() => parseBackup(JSON.stringify({ ...backup, schema_version: 2 }))).toThrow();
    await expect(store.change(profile => ({ ...profile, schema_version: 2 as 1 }))).rejects.toThrow();
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
  it('preserves unmatched history and reports it before replacement', () => {
    const profile = emptyProfile();
    profile.lessons['future-01'] = { read_at: null, scroll: 0 };
    profile.annotations['question:future-q001'] = blankAnnotation();
    profile.attempts.push({ ...createAttempt(catalogue.questions[0], [0]), answer_version: 'e'.repeat(64) });
    const parsed = parseBackup(JSON.stringify(makeBackup(profile, catalogue.content_version)));
    const summary = backupSummary(parsed.profile, catalogue);
    expect(summary.unmatchedLessons).toEqual(['future-01']);
    expect(summary.unmatchedAnnotations).toEqual(['question:future-q001']);
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
});
