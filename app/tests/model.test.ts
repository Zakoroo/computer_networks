import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { annotation, blankAnnotation, createAttempt, defaultCriteria, emptyProfile, exactAnswer, labels, latestAttempt, matches, nextLesson, orderedLessons, practiceMode, selectedQuestions } from '../src/model';
import type { Catalogue } from '../src/types';
import { contentRoute } from '../src/Markdown';

const catalogue = JSON.parse(readFileSync('public/content/catalogue.json', 'utf8')) as Catalogue;
const ordinary = catalogue.questions.find(q => q.question_id === 'dns-q001')!;
const flagged = catalogue.questions.find(q => q.question_id === 'tcp-q007')!;

describe('practice selection and preserved identity', () => {
  it('selects only linked ordinary practice by default and counts cross-topic questions once', () => {
    const questions = selectedQuestions(catalogue, emptyProfile());
    expect(questions).toHaveLength(165);
    expect(new Set(questions.map(q => q.question_id)).size).toBe(questions.length);
    expect(questions.find(q => q.question_id === 'routing-q036')?.lesson_id).toBe('dns-18');
  });
  it('combines fields with AND, values with OR, and lets exclusions win', () => {
    const profile = emptyProfile();
    profile.annotations['question:dns-q001'] = { ...blankAnnotation(), added_tags: ['hard', 'revision'], added_flags: ['revisit'] };
    const criteria = { ...defaultCriteria, topics: ['02_dns'], include_tags: ['other', 'hard'], include_flags: ['revisit'] };
    expect(matches(ordinary, criteria, profile)).toBe(true);
    expect(matches(ordinary, { ...criteria, exclude_tags: ['hard'] }, profile)).toBe(false);
    expect(matches(ordinary, { ...criteria, topics: ['01_routing'] }, profile)).toBe(false);
    expect(matches(ordinary, { ...criteria, exclude_flags: ['revisit'] }, profile)).toBe(false);
  });
  it('keeps canonical key findings out of scores even when their display is hidden', () => {
    const profile = emptyProfile();
    profile.annotations['question:tcp-q007'] = { ...blankAnnotation(), removed_flags: ['wording_issue'] };
    expect(labels(flagged, profile).flags).not.toContain('wording_issue');
    expect(practiceMode(flagged)).toBe('review');
    expect(matches(flagged, defaultCriteria, profile)).toBe(false);
    expect(matches(flagged, { ...defaultCriteria, practice: 'review' }, profile)).toBe(true);
  });
  it('does not invent classified dependencies and does not search answer explanations', () => {
    const unknown = catalogue.questions.find(q => q.question_id === 'routing-q001')!;
    expect(unknown.required_lesson_ids).toBeNull();
    expect(unknown.dependency_status).toBe('unclassified');
    expect(matches({ ...ordinary, explanation: 'uniquesecretfeedback' }, { ...defaultCriteria, search: 'uniquesecretfeedback' }, emptyProfile())).toBe(false);
  });
  it('keeps all reading, including lessons without practice, with prerequisites before priority', () => {
    const profile = emptyProfile();
    profile.criteria.topics = ['02_dns'];
    profile.annotations['lesson:tcp-06'] = { ...blankAnnotation(), priority: 'high' };
    const lessons = orderedLessons(catalogue, profile);
    expect(lessons).toHaveLength(155);
    expect(lessons.some(lesson => !catalogue.questions.some(q => q.lesson_id === lesson.id))).toBe(true);
    for (const lesson of lessons) {
      for (const prerequisite of lesson.prerequisite_ids) expect(lessons.findIndex(item => item.id === prerequisite)).toBeLessThan(lessons.indexOf(lesson));
    }
  });
  it('resumes the last chosen lesson and advances within that route after reading', () => {
    const profile = emptyProfile();
    profile.last_lesson_id = 'dns-01';
    expect(nextLesson(catalogue, profile)?.id).toBe('dns-01');
    profile.lessons['dns-01'] = { read_at: new Date().toISOString(), scroll: .4 };
    expect(nextLesson(catalogue, profile)?.id).toBe('dns-02');
    expect(nextLesson(catalogue, profile, 'dns-20')?.id).toBe('ipv6-01');
  });
});

describe('scoring and history', () => {
  it('requires an exact set for multiple answers without allowing duplicate indices', () => {
    expect(exactAnswer([2, 0], [0, 2])).toBe(true);
    expect(exactAnswer([0], [0, 2])).toBe(false);
    expect(exactAnswer([0, 1, 2], [0, 2])).toBe(false);
    expect(exactAnswer([0, 0], [0, 2])).toBe(false);
    expect(() => createAttempt(ordinary, [8])).toThrow();
  });
  it('retains a key snapshot and never silently reattaches an old attempt', () => {
    const profile = emptyProfile();
    const attempt = createAttempt(ordinary, ordinary.correct_answers);
    profile.attempts.push(attempt);
    expect(latestAttempt(ordinary, profile)?.correct).toBe(true);
    expect(attempt.correct_answers).toEqual(ordinary.correct_answers);
    expect(latestAttempt({ ...ordinary, answer_version: 'f'.repeat(64) }, profile)).toBeUndefined();
    expect(latestAttempt({ ...ordinary, question_sha256: 'a'.repeat(64) }, profile)).toBeUndefined();
    profile.attempts[0].correct_answers = [0];
    expect(latestAttempt(ordinary, profile)).toBeUndefined();
    expect(createAttempt(flagged, flagged.correct_answers).mode).toBe('review');
  });
  it('personal labels do not mutate imported tags or flags', () => {
    const snapshot = JSON.stringify(ordinary);
    const profile = emptyProfile();
    profile.annotations['question:dns-q001'] = { ...blankAnnotation(), added_tags: ['revision'], removed_flags: [...ordinary.flags] };
    expect(labels(ordinary, profile).tags).toContain('revision');
    expect(annotation(profile, 'question', 'dns-q001').priority).toBe('normal');
    expect(JSON.stringify(ordinary)).toBe(snapshot);
  });
});

describe('source-relative navigation', () => {
  it('resolves explanation, glossary, and same-document anchor links without exposing quiz JSON', () => {
    expect(contentRoute('../lessons/02_dns/01_names_and_urls.md', ordinary.source_quiz, catalogue)).toBe('/lesson/dns-01');
    expect(contentRoute('glossary.md', 'lessons/02_dns/01_names_and_urls.md', catalogue)).toBe('/doc/lessons%2F02_dns%2Fglossary.md');
    expect(contentRoute('#learning-goals', 'lessons/02_dns/01_names_and_urls.md', catalogue)).toBe('/lesson/dns-01?anchor=learning-goals');
    expect(contentRoute('../../quizzes/quiz_02_dns.json', 'lessons/02_dns/01_names_and_urls.md', catalogue)).toBe('/library');
    expect(contentRoute('https://example.org', ordinary.source_quiz, catalogue)).toBeNull();
  });
});
