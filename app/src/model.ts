import type { Annotation, Attempt, Catalogue, Criteria, Lesson, Profile, Question } from './types';

export const defaultCriteria: Criteria = {
  topics: [], include_tags: [], exclude_tags: [], include_flags: [], exclude_flags: [],
  coverage: 'linked', attempted: 'all', read: 'all', include_deferred: false,
  practice: 'scored', search: '',
};

export const emptyProfile = (): Profile => ({
  schema_version: 1, lessons: {}, annotations: {}, attempts: [],
  criteria: { ...defaultCriteria }, current_route: '/roadmap', last_lesson_id: null,
});

export const blankAnnotation = (): Annotation => ({
  added_tags: [], removed_tags: [], added_flags: [], removed_flags: [],
  priority: 'normal', deferred: false, updated_at: new Date().toISOString(),
});

export function annotation(profile: Profile, kind: 'lesson' | 'question', id: string): Annotation {
  return profile.annotations[`${kind}:${id}`] ?? blankAnnotation();
}

export function effectiveLabels(imported: string[], added: string[], removed: string[]) {
  return [...new Set([...imported, ...added])].filter(value => !removed.includes(value));
}

export function labels(question: Question, profile: Profile) {
  const note = annotation(profile, 'question', question.question_id);
  return {
    tags: effectiveLabels(question.tags, note.added_tags, note.removed_tags),
    flags: effectiveLabels(question.flags, note.added_flags, note.removed_flags),
  };
}

export function exactAnswer(selected: number[], correct: number[]) {
  return selected.length === correct.length && new Set(selected).size === selected.length
    && correct.every(index => selected.includes(index));
}

export function latestAttempt(question: Question, profile: Profile, scoredOnly = false): Attempt | undefined {
  return [...profile.attempts].reverse().find(attempt =>
    attempt.question_id === question.question_id
    && attempt.question_sha256 === question.question_sha256
    && attempt.answer_version === question.answer_version
    && attempt.option_count === question.options.length
    && exactAnswer(attempt.correct_answers, question.correct_answers)
    && (!scoredOnly || attempt.mode === 'scored'));
}

export function practiceMode(question: Question): 'scored' | 'review' {
  return !question.lesson_id || question.flags.includes('wording_issue') ? 'review' : 'scored';
}

export function createAttempt(question: Question, selected: number[]): Attempt {
  if (!selected.length || new Set(selected).size !== selected.length
    || selected.some(index => !Number.isInteger(index) || index < 0 || index >= question.options.length)
    || (question.correct_answers.length === 1 && selected.length !== 1)) {
    throw new Error('Choose a valid answer before submitting.');
  }
  return {
    id: crypto.randomUUID(), question_id: question.question_id,
    question_sha256: question.question_sha256, answer_version: question.answer_version,
    selected: [...selected].sort((a, b) => a - b), correct_answers: [...question.correct_answers],
    option_count: question.options.length, mode: practiceMode(question),
    correct: exactAnswer(selected, question.correct_answers), created_at: new Date().toISOString(),
  };
}

export function matches(question: Question, criteria: Criteria, profile: Profile) {
  const note = annotation(profile, 'question', question.question_id);
  const effective = labels(question, profile);
  const intersects = (values: string[], wanted: string[]) => wanted.some(value => values.includes(value));
  if (criteria.topics.length && !criteria.topics.includes(question.topic_id)) return false;
  if (!criteria.include_deferred && note.deferred) return false;
  if (criteria.coverage === 'linked' && !question.lesson_id) return false;
  if (criteria.coverage === 'unlinked' && question.lesson_id) return false;
  if (criteria.include_tags.length && !intersects(effective.tags, criteria.include_tags)) return false;
  if (intersects(effective.tags, criteria.exclude_tags)) return false;
  if (criteria.include_flags.length && !intersects(effective.flags, criteria.include_flags)) return false;
  if (intersects(effective.flags, criteria.exclude_flags)) return false;
  if (criteria.practice === 'scored' && practiceMode(question) !== 'scored') return false;
  const attempt = latestAttempt(question, profile);
  if (criteria.attempted === 'new' && attempt) return false;
  if (criteria.attempted === 'attempted' && !attempt) return false;
  if (criteria.attempted === 'incorrect' && (!attempt || attempt.correct || attempt.mode !== 'scored')) return false;
  const read = !!profile.lessons[question.lesson_id]?.read_at;
  if (criteria.read === 'read' && !read) return false;
  if (criteria.read === 'unread' && read) return false;
  const search = criteria.search.trim().toLocaleLowerCase();
  // Search stems/options only: never index explanations or answer-revealing notes.
  return !search || [question.question, ...question.options, question.question_id]
    .some(value => value.toLocaleLowerCase().includes(search));
}

const weight = { high: 0, normal: 1, low: 2 };
export function selectedQuestions(catalogue: Catalogue, profile: Profile) {
  return catalogue.questions.filter(q => matches(q, profile.criteria, profile))
    .sort((a, b) => weight[annotation(profile, 'question', a.question_id).priority]
      - weight[annotation(profile, 'question', b.question_id).priority]);
}

export function orderedLessons(catalogue: Catalogue, profile: Profile): Lesson[] {
  // Reading remains complete even when practice filters narrow the selected questions.
  // Topological ordering respects prerequisites; source order breaks priority ties.
  const remaining = [...catalogue.lessons];
  const result: Lesson[] = [];
  const included = new Set(remaining.map(lesson => lesson.id));
  const emitted = new Set<string>();
  while (remaining.length) {
    const ready = remaining.filter(lesson => lesson.prerequisite_ids.every(id => !included.has(id) || emitted.has(id)));
    if (!ready.length) throw new Error('Lesson prerequisite cycle detected.');
    ready.sort((a, b) => weight[annotation(profile, 'lesson', a.id).priority]
      - weight[annotation(profile, 'lesson', b.id).priority]);
    const next = ready[0];
    result.push(next);
    emitted.add(next.id);
    remaining.splice(remaining.indexOf(next), 1);
  }
  return result;
}

export function nextLesson(catalogue: Catalogue, profile: Profile, currentId?: string) {
  const ordered = orderedLessons(catalogue, profile);
  if (!currentId && profile.last_lesson_id) {
    const last = ordered.find(lesson => lesson.id === profile.last_lesson_id);
    if (last && !profile.lessons[last.id]?.read_at && !annotation(profile, 'lesson', last.id).deferred) return last;
    if (last) currentId = last.id;
  }
  const candidates = currentId ? ordered.slice(ordered.findIndex(lesson => lesson.id === currentId) + 1) : ordered;
  return candidates.find(lesson => !profile.lessons[lesson.id]?.read_at && !annotation(profile, 'lesson', lesson.id).deferred)
    ?? (!currentId ? undefined : ordered.find(lesson => !profile.lessons[lesson.id]?.read_at && !annotation(profile, 'lesson', lesson.id).deferred))
    ?? candidates.find(lesson => !annotation(profile, 'lesson', lesson.id).deferred);
}

export function backupSummary(profile: Profile, catalogue: Catalogue) {
  const lessonIds = new Set(catalogue.lessons.map(lesson => lesson.id));
  const questions = new Map(catalogue.questions.map(question => [question.question_id, question]));
  const unmatchedLessons = Object.keys(profile.lessons).filter(id => !lessonIds.has(id));
  const unmatchedAnnotations = Object.keys(profile.annotations).filter(key => {
    const [kind, id] = key.split(':');
    return kind === 'lesson' ? !lessonIds.has(id) : !questions.has(id);
  });
  const historicalAttempts = profile.attempts.filter(attempt => {
    const question = questions.get(attempt.question_id);
    return !question || question.question_sha256 !== attempt.question_sha256 || question.answer_version !== attempt.answer_version
      || question.options.length !== attempt.option_count || !exactAnswer(attempt.correct_answers, question.correct_answers);
  });
  return { unmatchedLessons, unmatchedAnnotations, historicalAttempts };
}
