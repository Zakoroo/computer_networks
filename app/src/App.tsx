import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, Circle, Flag, Layers, Library, Map, Menu, Network, ShieldCheck, X } from 'lucide-react';
import { annotation, defaultCriteria, labels, latestAttempt, nextLesson, orderedLessons, practiceMode, selectedQuestions } from './model';
import { BackupDialog, Filters, PersonalControls, shortTitle, type Update } from './Controls';
import Markdown from './Markdown';
import Quiz from './Quiz';
import { useStudy } from './useStudy';
import type { Catalogue, Lesson, Profile, Question } from './types';

function routeNow() { return location.hash.slice(1) || '/roadmap'; }

export default function App() {
  const { catalogue, profile, update, error, clearError, saving } = useStudy();
  const [route, setRoute] = useState(routeNow);
  const [mobileMenu, setMobileMenu] = useState(false);
  const initialized = useRef(false);
  const ready = Boolean(catalogue && profile);
  const navigate = useCallback((next: string) => {
    setRoute(next); location.hash = next; setMobileMenu(false);
  }, []);
  useEffect(() => {
    const handler = () => {
      const next = routeNow(); setRoute(next);
      void update(current => ({ ...current, current_route: next,
        last_lesson_id: next.startsWith('/lesson/') ? next.split('?')[0].slice('/lesson/'.length) : current.last_lesson_id }));
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [update]);
  useEffect(() => {
    if (!profile || initialized.current) return;
    initialized.current = true;
    if (!location.hash) { history.replaceState(null, '', `#${profile.current_route}`); setRoute(profile.current_route); }
    else if (location.hash.startsWith('#/lesson/')) {
      const id = location.hash.slice('#/lesson/'.length).split('?')[0];
      if (catalogue?.lessons.some(lesson => lesson.id === id)) void update(current => ({ ...current, last_lesson_id: id, current_route: routeNow() }));
    }
  }, [profile, catalogue, update]);
  useEffect(() => {
    if (!ready) return;
    const anchor = new URLSearchParams(route.split('?')[1]).get('anchor');
    const timer = setTimeout(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView();
      else if (!route.startsWith('/lesson/')) window.scrollTo(0, 0);
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [route, ready]);
  if (!catalogue || !profile) return <div className="loading-screen"><Network size={32} /><h1>Network Study</h1><p role={error ? 'alert' : 'status'}>{error || 'Opening your study space…'}</p>{error && <button className="button primary" onClick={() => location.reload()}>Try again</button>}</div>;

  const baseRoute = route.split('?')[0];
  const selectedLesson = catalogue.lessons.find(lesson => baseRoute === `/lesson/${lesson.id}`);
  const selectedQuestion = catalogue.questions.find(question => baseRoute === `/question/${question.question_id}`);
  const section = baseRoute === '/library' || selectedQuestion ? 'library' : selectedLesson || baseRoute.startsWith('/doc/') ? 'study' : 'roadmap';
  const readCount = catalogue.lessons.filter(lesson => profile.lessons[lesson.id]?.read_at).length;
  const questions = selectedQuestions(catalogue, profile);
  const lessonProgress = (topicId: string) => {
    const lessons = catalogue.lessons.filter(lesson => lesson.topic_id === topicId);
    return { total: lessons.length, read: lessons.filter(lesson => profile.lessons[lesson.id]?.read_at).length };
  };
  const resume = () => {
    const target = nextLesson(catalogue, profile);
    if (target) navigate(`/lesson/${target.id}`);
  };
  return <div className="app-shell">
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
      <a href="#/roadmap" className="brand" onClick={event => { event.preventDefault(); navigate('/roadmap'); }}><span className="brand-mark"><Network size={23} /></span><span>Network<span className="brand-light">Study</span></span></a>
      <button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setMobileMenu(false)}><X /></button>
      <p className="sidebar-eyebrow">YOUR STUDY SPACE</p>
      <nav aria-label="Main navigation">
        <a href="#/roadmap" className={section === 'roadmap' ? 'active' : ''} onClick={event => { event.preventDefault(); navigate('/roadmap'); }}><Map size={18} /> Roadmap</a>
        <button className={section === 'study' ? 'active' : ''} onClick={resume}><BookOpen size={18} /> Continue reading</button>
        <a href="#/library" className={section === 'library' ? 'active' : ''} onClick={event => { event.preventDefault(); navigate('/library'); }}><Library size={18} /> Question library <span className="nav-count">{catalogue.questions.length}</span></a>
      </nav>
      <div className="sidebar-section"><span className="sidebar-eyebrow">NETWORKING</span><span className="sidebar-small">01 — 06</span></div>
      <div className="topic-nav">{catalogue.topics.map(topic => {
        const stats = lessonProgress(topic.id);
        const first = catalogue.lessons.find(lesson => lesson.topic_id === topic.id && !profile.lessons[lesson.id]?.read_at)
          ?? catalogue.lessons.find(lesson => lesson.topic_id === topic.id)!;
        const active = selectedLesson?.topic_id === topic.id;
        return <div key={topic.id}><a href={`#/lesson/${first.id}`} className={active ? 'active' : ''} onClick={event => { event.preventDefault(); navigate(`/lesson/${first.id}`); }}><span className="topic-number">{topic.id.slice(0, 2)}</span><span>{shortTitle(topic.id)}<span className="topic-sub">{stats.read} / {stats.total} lessons read</span></span>{active ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</a>
          {active && <div className="lesson-nav">{catalogue.lessons.filter(lesson => lesson.topic_id === topic.id).map(lesson => <a key={lesson.id} href={`#/lesson/${lesson.id}`} aria-current={lesson.id === selectedLesson.id ? 'page' : undefined} onClick={event => { event.preventDefault(); navigate(`/lesson/${lesson.id}`); }}>
            {profile.lessons[lesson.id]?.read_at ? <Check size={12} /> : <Circle size={8} />}<span>{lesson.title}</span></a>)}</div>}
        </div>;
      })}</div>
      <div className="sidebar-bottom"><div className="sidebar-section"><span>Your reading progress</span><strong>{Math.round(readCount / catalogue.lessons.length * 100)}%</strong></div><div className="progress-track"><span style={{ width: `${readCount / catalogue.lessons.length * 100}%` }} /></div><p>{readCount} of {catalogue.lessons.length} lessons read</p><span className="local-note"><ShieldCheck size={14} /> Local to this browser</span></div>
    </aside>
    {mobileMenu && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
    <div className="workspace">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Menu /></button><span>Computer networks</span><ChevronRight size={13} /><strong>{section === 'roadmap' ? 'Your roadmap' : section === 'library' ? 'Question library' : 'Study session'}</strong></div>
        <div className="topbar-actions"><span className="save-status" role="status"><span className={`status-dot ${saving ? 'saving' : ''}`} />{saving ? 'Saving…' : 'Saved in this browser'}</span><BackupDialog catalogue={catalogue} profile={profile} update={update} navigate={navigate} saving={saving} /></div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {error && <div className="notice danger" role="alert">{error}<button className="text-button" onClick={clearError}>Dismiss</button></div>}
        {baseRoute === '/roadmap' && <Roadmap catalogue={catalogue} profile={profile} questions={questions} update={update} navigate={navigate} />}
        {baseRoute === '/library' && <QuestionLibrary catalogue={catalogue} profile={profile} questions={questions} update={update} navigate={navigate} />}
        {selectedLesson && <Study key={selectedLesson.id + JSON.stringify(profile.criteria)} lesson={selectedLesson} catalogue={catalogue} profile={profile} questions={questions} update={update} navigate={navigate} route={route} />}
        {selectedQuestion && <div className="question-page"><button className="text-button" onClick={() => navigate('/library')}>← Question library</button><h1>One question, a little clearer.</h1>{selectedQuestion.lesson_id && <a className="lesson-return" href={`#/lesson/${selectedQuestion.lesson_id}`} onClick={event => { event.preventDefault(); navigate(`/lesson/${selectedQuestion.lesson_id}`); }}><BookOpen size={16} /> Read the supporting lesson<ArrowRight size={15} /></a>}<Quiz key={selectedQuestion.question_id} question={selectedQuestion} catalogue={catalogue} profile={profile} update={update} navigate={navigate} /></div>}
        {baseRoute.startsWith('/doc/') && <Document route={route} catalogue={catalogue} navigate={navigate} />}
        {!selectedLesson && !selectedQuestion && !['/roadmap', '/library'].includes(baseRoute) && !baseRoute.startsWith('/doc/') && <div className="empty-state"><h1>This page is unavailable.</h1><button className="button primary" onClick={() => navigate('/roadmap')}>Back to your roadmap</button></div>}
      </main>
      <footer className="app-footer"><span>Learn the concept. Make the connection.</span><span>Networking · 6 topics · local study</span></footer>
    </div>
  </div>;
}

function FilterPanel({ catalogue, profile, update }: { catalogue: Catalogue; profile: Profile; update: Update }) {
  return <Filters catalogue={catalogue} criteria={profile.criteria} updateCriteria={value => void update(current => ({ ...current, criteria: { ...current.criteria, ...value } }))}
    reset={() => void update(current => ({ ...current, criteria: { ...defaultCriteria } }))} />;
}

function Roadmap({ catalogue, profile, questions, update, navigate }: {
  catalogue: Catalogue; profile: Profile; questions: Question[]; update: Update; navigate: (route: string) => void;
}) {
  const next = nextLesson(catalogue, profile);
  const read = catalogue.lessons.filter(lesson => profile.lessons[lesson.id]?.read_at).length;
  const scored = catalogue.questions.filter(question => practiceMode(question) === 'scored');
  const attempted = scored.filter(question => latestAttempt(question, profile, true));
  const correct = attempted.filter(question => latestAttempt(question, profile, true)?.correct).length;
  return <div className="roadmap-page">
    <div className="page-heading"><div><span className="eyebrow">A LITTLE EVERY DAY</span><h1>Your next connection.</h1><p>One lesson at a time. Read, practice, and make it stick.</p></div><span className="course-pill"><Layers size={15} /> Networking course</span></div>
    <div className="overview-grid">
      <section className="continue-card"><div><span className="eyebrow">{read ? 'PICK UP WHERE YOU LEFT OFF' : 'A GOOD PLACE TO BEGIN'}</span><h2>{next?.title ?? 'Your reading roadmap is complete.'}</h2><p>{next ? `${shortTitle(next.topic_id)} · Lesson ${String(next.order).padStart(2, '0')} · ${next.estimated_reading_minutes} min read` : 'Revisit any topic below.'}</p>{next && <button className="button cream" onClick={() => navigate(`/lesson/${next.id}`)}>{read ? 'Continue studying' : 'Start studying'}<ArrowRight size={17} /></button>}</div><div className="connection-art" aria-hidden="true"><div /><div /><div /><div /><Network size={70} strokeWidth={0.8} /></div></section>
      <section className="progress-card"><span className="eyebrow">YOUR PROGRESS</span><div className="progress-stat"><strong>{read}<small> / {catalogue.lessons.length}</small></strong><span>lessons marked read</span></div><div className="progress-track"><span style={{ width: `${read / catalogue.lessons.length * 100}%` }} /></div><div className="practice-stat"><span>{attempted.length} / {scored.length} ordinary questions attempted</span><strong>{attempted.length ? `${correct} latest answers correct` : 'A fresh start'}</strong></div></section>
    </div>
    <div className="section-heading"><div><h2>Your reading roadmap</h2><p>All lessons stay available, including those without quiz questions.</p></div><span className="muted small">6 topics · {catalogue.lessons.length} lessons</span></div>
    <div className="roadmap-topics">{catalogue.topics.map(topic => {
      const topicLessons = orderedLessons(catalogue, profile).filter(lesson => lesson.topic_id === topic.id);
      const topicRead = topicLessons.filter(lesson => profile.lessons[lesson.id]?.read_at).length;
      const topicSelected = questions.filter(question => catalogue.lessons.some(lesson => lesson.id === question.lesson_id && lesson.topic_id === topic.id)).length;
      return <details key={topic.id} className="topic-card" open={next?.topic_id === topic.id ? true : undefined}>
        <summary><span className="roadmap-number">{topic.id.slice(0, 2)}</span><div className="topic-summary"><h3>{shortTitle(topic.id)}</h3><span>{topicLessons.length} lessons · {topicSelected} selected practice questions</span></div><div className="topic-completion"><span>{topicRead} / {topicLessons.length} read</span><div className="progress-track"><span style={{ width: `${topicRead / topicLessons.length * 100}%` }} /></div></div><ChevronDown size={17} /></summary>
        <div className="lesson-list">{topicLessons.map(lesson => {
          const count = questions.filter(question => question.lesson_id === lesson.id).length;
          const total = catalogue.questions.filter(question => question.lesson_id === lesson.id).length;
          const note = annotation(profile, 'lesson', lesson.id);
          return <a key={lesson.id} href={`#/lesson/${lesson.id}`} onClick={event => { event.preventDefault(); navigate(`/lesson/${lesson.id}`); }}><span className={`lesson-status ${profile.lessons[lesson.id]?.read_at ? 'read' : ''}`}>{profile.lessons[lesson.id]?.read_at ? <Check size={13} /> : String(lesson.order).padStart(2, '0')}</span><span className="lesson-list-title">{lesson.title}{note.deferred && <span className="badge">Deferred</span>}{note.added_flags.includes('revisit') && <Flag size={12} />}</span><span className="lesson-list-meta">{lesson.estimated_reading_minutes} min <span>· {total ? `${count}/${total} practice` : 'Reading only'}</span></span><ArrowRight size={15} /></a>;
        })}</div>
      </details>;
    })}</div>
    <div className="section-heading"><div><h2>Practice, on your terms.</h2><p>{questions.length} questions match your current choices. These filters apply to practice throughout the app.</p></div><button className="text-button" onClick={() => navigate('/library')}>Open library<ArrowRight size={15} /></button></div>
    <FilterPanel catalogue={catalogue} profile={profile} update={update} />
  </div>;
}

function Study({ lesson, catalogue, profile, questions, update, navigate, route }: {
  lesson: Lesson; catalogue: Catalogue; profile: Profile; questions: Question[]; update: Update; navigate: (route: string) => void; route: string;
}) {
  const initialScroll = useRef(profile.lessons[lesson.id]?.scroll ?? 0);
  useEffect(() => {
    if (!route.includes('?anchor=')) {
      const timer = setTimeout(() => window.scrollTo(0, initialScroll.current * Math.max(0, document.documentElement.scrollHeight - innerHeight)), 200);
      return () => clearTimeout(timer);
    }
  }, [lesson.id, route]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const save = () => {
      const scroll = Math.max(0, Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
      void update(current => ({ ...current, lessons: { ...current.lessons,
        [lesson.id]: { read_at: current.lessons[lesson.id]?.read_at ?? null, scroll } } }));
    };
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(save, 400); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, [lesson.id, update]);
  const assigned = catalogue.questions.filter(question => question.lesson_id === lesson.id);
  // Keep the current session visible after submission, even with an "unattempted" filter.
  // Changing criteria or navigating to a new lesson starts a newly computed session.
  const [selected] = useState(() => questions.filter(question => question.lesson_id === lesson.id));
  const next = nextLesson(catalogue, profile, lesson.id);
  const isRead = !!profile.lessons[lesson.id]?.read_at;
  const prerequisites = lesson.prerequisite_ids.filter(id => !profile.lessons[id]?.read_at);
  return <div className="study-page">
    <div className="study-heading"><span className="eyebrow">{shortTitle(lesson.topic_id)} <span>/</span> LESSON {String(lesson.order).padStart(2, '0')}</span><div><span className="badge">{lesson.estimated_reading_minutes} min read</span><span className={`badge ${isRead ? 'green' : ''}`}>{isRead ? 'Marked read' : 'Unread'}</span></div></div>
    <div className="study-layout"><div className="study-main">
      <article className="reader-card">
        {lesson.source_classification.includes('supplement') && <p className="notice">Supplementary material · retain this qualification when reviewing exam scope.</p>}
        <Markdown text={lesson.markdown} origin={lesson.path} catalogue={catalogue} navigate={navigate} />
        <div className="reader-completion"><button className={`button ${isRead ? 'secondary' : 'primary'}`} onClick={() => void update(current => ({ ...current, lessons: { ...current.lessons,
          [lesson.id]: { scroll: current.lessons[lesson.id]?.scroll ?? 0, read_at: current.lessons[lesson.id]?.read_at ? null : new Date().toISOString() } } }))}>{isRead ? <Check size={16} /> : <BookOpen size={16} />}{isRead ? 'Marked read · undo' : 'Mark lesson read'}</button><a href="#practice" className="text-button" onClick={event => { event.preventDefault(); document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' }); }}>Continue to practice<ArrowDown size={15} /></a></div>
      </article>
      <section id="practice" className="lesson-practice"><div className="section-heading"><div><span className="eyebrow">PUT IT INTO PRACTICE</span><h2>Make the connection.</h2><p>{selected.length} of {assigned.length} assigned questions selected.</p></div></div>
        {assigned.length > selected.length && <p className="notice small">{assigned.length - selected.length} questions are hidden by your current practice filters. <button className="text-button" onClick={() => void update(current => ({ ...current, criteria: { ...defaultCriteria, practice: 'review' } }))}>Show all assigned questions</button></p>}
        {!assigned.length && <div className="empty-state compact"><BookOpen size={25} /><h3>A reading-only lesson.</h3><p>The lecture teaches this material without a supplied quiz question. Mark it read when you’re ready and continue.</p></div>}
        {selected.map(question => <Quiz key={question.question_id} question={question} catalogue={catalogue} profile={profile} update={update} navigate={navigate} />)}
      </section>
      <div className="next-lesson"><div><span className="eyebrow">KEEP GOING</span><h3>{next?.title ?? 'You’ve reached the end of the reading route.'}</h3></div><button className="button primary" onClick={() => navigate(next ? `/lesson/${next.id}` : '/roadmap')}>{next ? 'Next lesson' : 'Back to roadmap'}<ArrowRight size={16} /></button></div>
    </div><aside className="study-rail"><div className="rail-card"><span className="eyebrow">YOUR LESSON</span><h3>Make it your own.</h3><PersonalControls kind="lesson" id={lesson.id} profile={profile} update={update} /><hr /><div className="rail-fact"><BookOpen size={16} /><span>{assigned.length} related questions<br /><small>{selected.length} in your practice queue</small></span></div><p className="small muted">Reading and quiz progress are tracked separately.</p></div>
      {prerequisites.length > 0 && <div className="rail-card"><h3>Builds on</h3><p className="small muted">These prerequisite lessons are not marked read. You can keep reading or revisit them.</p>{prerequisites.map(id => <a className="rail-link" key={id} href={`#/lesson/${id}`} onClick={event => { event.preventDefault(); navigate(`/lesson/${id}`); }}>{catalogue.lessons.find(item => item.id === id)?.title}<ArrowRight size={13} /></a>)}</div>}
      <div className="rail-card quiet"><span className="eyebrow">REFERENCE DESK</span>{['glossary.md', 'references.md'].map(file => { const path = lesson.path.replace(/[^/]+$/, file); return catalogue.documents[path] && <a className="rail-link" href={`#/doc/${encodeURIComponent(path)}`} key={file} onClick={event => { event.preventDefault(); navigate(`/doc/${encodeURIComponent(path)}`); }}>{file === 'glossary.md' ? 'Topic glossary' : 'Source references'}<ArrowRight size={13} /></a>; })}<a className="rail-link" href={`/content/source/${lesson.path}`} download>Download lesson Markdown<ArrowDown size={13} /></a></div>
    </aside></div>
  </div>;
}

function QuestionLibrary({ catalogue, profile, questions, update, navigate }: {
  catalogue: Catalogue; profile: Profile; questions: Question[]; update: Update; navigate: (route: string) => void;
}) {
  const [limit, setLimit] = useState(30);
  return <div className="library-page"><div className="page-heading"><div><span className="eyebrow">FIND YOUR FOCUS</span><h1>The question library.</h1><p>Explore questions, revisit a concept, or narrow your next practice session.</p></div><button className="button secondary" onClick={() => void update(current => ({ ...current, criteria: { ...defaultCriteria, coverage: 'all', practice: 'review' } }))}>Show all questions</button></div>
    <FilterPanel catalogue={catalogue} profile={profile} update={update} /><div className="library-count"><strong>{questions.length} questions selected</strong><span>of {catalogue.questions.length} total · answers stay hidden until submission</span></div>
    <div className="question-list">{questions.slice(0, limit).map(question => {
      const effective = labels(question, profile);
      const attempted = latestAttempt(question, profile);
      return <a className="question-row" key={question.question_id} href={`#/question/${question.question_id}`} onClick={event => { event.preventDefault(); navigate(`/question/${question.question_id}`); }}><div className="question-row-top"><span className="eyebrow">{shortTitle(question.topic_id)} · Q{String(question.source_index + 1).padStart(3, '0')}</span><span className={`badge ${practiceMode(question) === 'review' ? 'amber' : 'green'}`}>{practiceMode(question) === 'review' ? 'Review' : 'Practice'}</span>{attempted && <span className="badge">Attempted</span>}</div><h3>{question.question}</h3><div className="question-row-bottom"><span>{question.lesson_id ? catalogue.lessons.find(lesson => lesson.id === question.lesson_id)?.title : 'Coverage gap · no primary lesson'}{effective.tags.length ? ` · ${effective.tags.join(', ')}` : ''}</span><ArrowRight size={17} /></div></a>;
    })}</div>{!questions.length && <div className="empty-state"><Library size={30} /><h2>No questions match these choices.</h2><p>Adjust your filters or show all questions. Your reading roadmap is still available.</p></div>}{questions.length > limit && <button className="button secondary load-more" onClick={() => setLimit(value => value + 30)}>Show 30 more questions</button>}</div>;
}

function Document({ route, catalogue, navigate }: { route: string; catalogue: Catalogue; navigate: (route: string) => void }) {
  let path = '';
  try { path = decodeURIComponent(route.split('?')[0].slice('/doc/'.length)); } catch { /* Invalid URL is shown as unavailable. */ }
  const text = Object.hasOwn(catalogue.documents, path) ? catalogue.documents[path] : undefined;
  return <div className="document-page"><button className="text-button" onClick={() => navigate('/roadmap')}>← Reading roadmap</button>{text ? <article className="reader-card"><Markdown text={text} origin={path} catalogue={catalogue} navigate={navigate} /><a href={`/content/source/${path}`} download>Download original Markdown</a></article> : <div className="empty-state"><h1>This reference is unavailable.</h1><p>Return to the reading roadmap to continue.</p></div>}</div>;
}
