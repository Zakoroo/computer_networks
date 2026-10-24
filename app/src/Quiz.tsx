import { useState } from 'react';
import { ArrowRight, Check, CircleHelp, RotateCcw, X } from 'lucide-react';
import Markdown from './Markdown';
import { PersonalControls, shortTitle, type Update } from './Controls';
import { createAttempt, latestAttempt, practiceMode } from './model';
import type { Catalogue, Profile, Question } from './types';

const flagNotices: Record<string, string> = {
  wording_issue: 'Wording/key review: this question may be ambiguous or have an incorrect answer key. Read the review finding after submitting.',
  coverage_gap: 'Coverage gap: the available lectures do not fully teach this question.',
  cross_topic: 'Cross-topic: relevant teaching may span topics. Check the linked primary and supporting lessons.',
  supplementary_source: 'Supplementary material: this question relies on material marked supplementary in the course guides.',
  duplicate_question: 'Duplicate question: equivalent entries are retained in the question bank.',
};

export default function Quiz({ question, catalogue, profile, update, navigate }: {
  question: Question; catalogue: Catalogue; profile: Profile; update: Update; navigate: (route: string) => void;
}) {
  // A fresh visit starts unrevealed, even if a previous attempt exists.
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const mode = practiceMode(question);
  const multiple = question.correct_answers.length > 1;
  const last = latestAttempt(question, profile);
  const current = submitted ? last : undefined;
  const required = question.required_lesson_ids ?? [];
  const unread = required.filter(id => !profile.lessons[id]?.read_at);
  const lessonLink = (id: string) => <a key={id} href={`#/lesson/${id}`} onClick={event => { event.preventDefault(); navigate(`/lesson/${id}`); }}>{catalogue.lessons.find(lesson => lesson.id === id)?.title ?? id}<ArrowRight size={13} /></a>;
  return <section className="quiz-card" aria-label={`Question ${question.question_id}`}>
    <div className="quiz-meta"><span className="eyebrow">{shortTitle(question.topic_id)} · Q{String(question.source_index + 1).padStart(3, '0')}</span>
      <span className={`badge ${mode === 'review' ? 'amber' : 'green'}`}>{mode === 'review' ? 'Review · outside score' : 'Ordinary practice'}</span></div>
    <div className={`question-status notice small ${question.flags.length ? '' : 'clear'}`} role="note" aria-label="Question status">
      <strong><CircleHelp size={15} aria-hidden="true" /> Question status</strong>
      {question.flags.length > 0 ? <ul>{question.flags.map(flag => <li key={flag}>{flagNotices[flag] ?? `Content flag: ${flag.replaceAll('_', ' ')}.`}</li>)}</ul>
        : <p>No content flags are recorded for this question.</p>}
      {!question.lesson_id && !question.flags.includes('coverage_gap') && <p>No primary lesson is assigned to this question.</p>}
      <p>Correct/Incorrect compares your answer with the original answer key.{mode === 'review' && ' This review question is outside the ordinary score.'}</p>
    </div>
    {unread.length > 0 && <div className="support-box"><strong>Additional required reading</strong><p className="small">These lessons are not marked read. You can open them now or submit your answer.</p><div className="support-links">{unread.map(lessonLink)}</div></div>}
    {question.dependency_status !== 'classified' && question.lesson_id && <p className="small muted">Supporting reading has not been fully classified. You can practice, but readiness has not been established.</p>}
    {question.optional_lesson_ids && question.optional_lesson_ids.length > 0 && <details className="support-box"><summary>Optional background ({question.optional_lesson_ids.length})</summary><div className="support-links">{question.optional_lesson_ids.map(lessonLink)}</div></details>}
    {question.dependency_status !== 'classified' && question.related_lesson_ids.length > 0 && <details className="support-box"><summary>Related reading · requirement unclassified</summary><div className="support-links">{question.related_lesson_ids.map(lessonLink)}</div></details>}
    <fieldset disabled={submitted || busy} className="question-fieldset">
      <legend><Markdown text={question.question} origin={question.source_quiz} catalogue={catalogue} navigate={navigate} /></legend>
      <p className="small muted">{multiple ? 'Select all answers that apply.' : 'Select one answer.'}</p>
      <div className="options">{question.options.map((option, index) => {
        const chosen = selected.includes(index);
        const inKey = question.correct_answers.includes(index);
        let resultClass = '';
        let resultLabel = '';
        if (submitted) {
          if (inKey) {
            resultClass = 'answer-correct';
            resultLabel = chosen ? 'Your answer · correct' : 'Correct answer';
          } else if (chosen) {
            resultClass = 'answer-incorrect';
            resultLabel = 'Your answer · incorrect';
          }
        }
        return <label key={index} className={`option ${chosen ? 'selected' : ''} ${resultClass}`}>
          <input type={multiple ? 'checkbox' : 'radio'} name={question.question_id} checked={chosen} onChange={() => setSelected(values => multiple ? values.includes(index) ? values.filter(value => value !== index) : [...values, index] : [index])} />
          <span className="option-letter">{String.fromCharCode(65 + index)}</span><Markdown text={option} origin={question.source_quiz} catalogue={catalogue} navigate={navigate} />
          {resultLabel && <span className="answer-indicator">
            {inKey ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
            {resultLabel}
          </span>}
        </label>;
      })}</div>
    </fieldset>
    {!submitted && <button className="button primary" disabled={!selected.length || busy} onClick={async () => {
      setBusy(true); const attempt = createAttempt(question, selected);
      if (await update(currentProfile => ({ ...currentProfile, attempts: [...currentProfile.attempts, attempt] }))) setSubmitted(true);
      setBusy(false);
    }}>{busy ? 'Saving answer…' : 'Submit'}<ArrowRight size={16} /></button>}
    {current && <div className={`feedback ${current.correct ? 'correct' : 'incorrect'}`} aria-live="polite">
      <h3>{current.correct ? <Check size={22} aria-hidden="true" /> : <X size={22} aria-hidden="true" />}
        {current.correct ? 'Correct' : 'Incorrect'}
      </h3>
      <p className="small">Compared with the original answer key.{mode === 'review' && ' Review attempt · outside the ordinary score.'}</p>
      {question.flags.includes('wording_issue') && <p className="notice small">Wording/key review: this result follows the preserved key, which may be ambiguous or incorrect. Check the explanation and review finding below.</p>}
      {question.explanation ? <Markdown text={question.explanation} origin={question.source_quiz} catalogue={catalogue} navigate={navigate} /> : <p>No authored explanation is available for this question.</p>}
      {question.review_note && <div className="notice"><strong>Review finding</strong><Markdown text={question.review_note} origin={question.source_quiz} catalogue={catalogue} navigate={navigate} /></div>}
      <p className="small muted">{question.explanation && <>Explanation status: {catalogue.topics.find(topic => topic.id === question.topic_id)?.explanation_status === 'approved' ? 'user approved' : 'agent reviewed; awaiting your approval'}. </>}Original answer key preserved.</p>
      <button className="text-button" onClick={() => { setSubmitted(false); setSelected([]); }}><RotateCcw size={14} /> Try again</button>
    </div>}
    <PersonalControls kind="question" id={question.question_id} question={question} profile={profile} update={update} />
    {!submitted && last && <p className="small muted">Previously attempted · {new Date(last.created_at).toLocaleDateString()}. Submit a new answer to see feedback.</p>}
  </section>;
}
