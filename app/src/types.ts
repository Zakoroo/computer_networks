export interface Topic {
  id: string;
  title: string;
  preparation_status: string;
  explanation_status: string;
}
export interface Lesson {
  id: string;
  title: string;
  topic_id: string;
  order: number;
  path: string;
  prerequisite_ids: string[];
  source_classification: string;
  estimated_reading_minutes: number;
  markdown: string;
}
export interface Question {
  question_id: string;
  question_sha256: string;
  answer_version: string;
  source_quiz: string;
  source_index: number;
  topic_id: string;
  topic_title: string;
  question: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
  lesson_id: string;
  flags: string[];
  tags: string[];
  coverage_status: string;
  required_lesson_ids: string[] | null;
  optional_lesson_ids: string[] | null;
  related_lesson_ids: string[];
  dependency_status: string;
  rationale: string | null;
  review_note: string | null;
}
export interface Catalogue {
  schema_version: 1;
  content_version: string;
  topics: Topic[];
  lessons: Lesson[];
  questions: Question[];
  documents: Record<string, string>;
}
export type Priority = 'high' | 'normal' | 'low';
export interface Annotation {
  added_tags: string[];
  removed_tags: string[];
  added_flags: string[];
  removed_flags: string[];
  priority: Priority;
  deferred: boolean;
  updated_at: string;
}
export interface LessonState { read_at: string | null; scroll: number }
export interface Attempt {
  id: string;
  question_id: string;
  question_sha256: string;
  answer_version: string;
  selected: number[];
  correct_answers: number[];
  option_count: number;
  mode: 'scored' | 'review';
  correct: boolean;
  created_at: string;
}
export interface Criteria {
  topics: string[];
  include_tags: string[];
  exclude_tags: string[];
  include_flags: string[];
  exclude_flags: string[];
  coverage: 'linked' | 'unlinked' | 'all';
  attempted: 'all' | 'new' | 'attempted' | 'incorrect';
  read: 'all' | 'read' | 'unread';
  include_deferred: boolean;
  practice: 'scored' | 'review';
  search: string;
}
export interface Profile {
  schema_version: 1;
  lessons: Record<string, LessonState>;
  annotations: Record<string, Annotation>;
  attempts: Attempt[];
  criteria: Criteria;
  current_route: string;
  last_lesson_id: string | null;
}
export interface Backup {
  format: 'network-study-backup';
  schema_version: 1;
  exported_at: string;
  content_version: string;
  profile: Profile;
}
