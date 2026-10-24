import { useEffect, useId, useRef, useState } from 'react';
import { Download, Flag, Plus, RotateCcw, Upload, X } from 'lucide-react';
import { annotation, backupSummary, effectiveLabels } from './model';
import { makeBackup, parseBackup } from './storage';
import type { Annotation, Backup, Catalogue, Criteria, Profile, Question } from './types';

export type Update = (mutate: (current: Profile) => Profile) => Promise<boolean>;

export function PersonalControls({ kind, id, question, profile, update }: {
  kind: 'lesson' | 'question'; id: string; question?: Question; profile: Profile; update: Update;
}) {
  const note = annotation(profile, kind, id);
  const helpId = useId();
  const [tag, setTag] = useState('');
  const tags = effectiveLabels(question?.tags ?? [], note.added_tags, note.removed_tags);
  const flags = effectiveLabels(question?.flags ?? [], note.added_flags, note.removed_flags);
  const edit = (mutate: (note: Annotation) => Annotation) => update(current => ({
    ...current, annotations: { ...current.annotations,
      [`${kind}:${id}`]: { ...mutate(annotation(current, kind, id)), updated_at: new Date().toISOString() } },
  }));
  const toggleFlag = (flag: string) => void edit(current => {
    const present = effectiveLabels(question?.flags ?? [], current.added_flags, current.removed_flags).includes(flag);
    return { ...current,
      added_flags: present ? current.added_flags.filter(value => value !== flag) : [...new Set([...current.added_flags, flag])],
      removed_flags: present ? [...new Set([...current.removed_flags, flag])] : current.removed_flags.filter(value => value !== flag),
    };
  });
  return <div className="personal-controls">
    <div className="control-row">
      <button className={`chip-button ${flags.includes('revisit') ? 'active' : ''}`} aria-pressed={flags.includes('revisit')} aria-describedby={`${helpId}-revisit`} onClick={() => toggleFlag('revisit')}><Flag size={14} /> Revisit</button>
      <button className={`chip-button ${note.deferred ? 'active' : ''}`} aria-pressed={note.deferred} aria-describedby={`${helpId}-defer`} onClick={() => void edit(current => ({ ...current, deferred: !current.deferred }))}>Defer</button>
      <label className="inline-label">Priority <select aria-label={`${kind} priority`} aria-describedby={`${helpId}-priority`} value={note.priority} onChange={event => {
        const priority = event.currentTarget.value as Annotation['priority'];
        void edit(current => ({ ...current, priority }));
      }}>
        <option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
      </select></label>
    </div>
    <details className="controls-help">
      <summary>What do these controls do?</summary>
      <p id={`${helpId}-priority`}><strong>Priority.</strong> {kind === 'lesson'
        ? 'Orders the roadmap High, then Normal, then Low where prerequisites allow. Continue studying can resume your unfinished lesson first.'
        : 'Orders matching questions High, then Normal, then Low when a practice queue is built. An open lesson session keeps its current question order.'}</p>
      <p id={`${helpId}-revisit`}><strong>Revisit.</strong> {kind === 'lesson'
        ? 'Adds a bookmark flag to this lesson on your roadmap. Set Priority separately to change its order.'
        : 'Bookmarks this question. Enter revisit in Include flags to find it again. Set Priority separately to change its order.'}</p>
      <p id={`${helpId}-defer`}><strong>Defer.</strong> {kind === 'lesson'
        ? 'Skips this lesson in Continue studying suggestions. It stays on the roadmap, and its questions remain available. Press Defer again to resume it.'
        : 'Leaves this question out of future practice selections by default. Turn on Include deferred questions to include it, or press Defer again to resume it.'}</p>
    </details>
    <div className="tags-row">
      {tags.map(value => <button className="tag" key={value} aria-label={`Remove tag ${value}`} onClick={() => void edit(current => ({ ...current,
        added_tags: current.added_tags.filter(item => item !== value), removed_tags: [...new Set([...current.removed_tags, value])],
      }))}>{value}<X size={12} /></button>)}
      <form className="tag-form" onSubmit={event => {
        event.preventDefault(); const value = tag.trim(); if (!value) return;
        void edit(current => ({ ...current, added_tags: [...new Set([...current.added_tags, value])],
          removed_tags: current.removed_tags.filter(item => item !== value) })).then(saved => { if (saved) setTag(''); });
      }}><input value={tag} maxLength={60} onChange={event => setTag(event.target.value)} placeholder="Add a tag…" aria-label={`Add ${kind} tag`} /><button className="icon-button" aria-label={`Save ${kind} tag`} disabled={!tag.trim()}><Plus size={16} /></button></form>
    </div>
    {question && question.flags.length > 0 && <details className="audit-controls"><summary>Content flags ({question.flags.length})</summary>
      <p className="muted small">Personal visibility changes preserve the original finding and scoring rules.</p>
      {question.flags.map(flag => <label className="check-label" key={flag}><input type="checkbox" checked={flags.includes(flag)} onChange={() => toggleFlag(flag)} />{flag.replaceAll('_', ' ')}</label>)}
    </details>}
  </div>;
}

function TokenInput({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  const [draft, setDraft] = useState(values.join(', '));
  const serialized = values.join(', ');
  useEffect(() => setDraft(serialized), [serialized]);
  return <label>{label}<input value={draft} placeholder="Comma-separated labels" onChange={event => setDraft(event.target.value)}
    onBlur={() => onChange([...new Set(draft.split(',').map(value => value.trim()).filter(Boolean))])} /></label>;
}

export function Filters({ catalogue, criteria, updateCriteria, reset }: {
  catalogue: Catalogue; criteria: Criteria; updateCriteria: (value: Partial<Criteria>) => void; reset: () => void;
}) {
  return <div className="filters">
    <div className="filter-row">
      <label className="search-field"><span className="sr-only">Search questions</span><input type="search" placeholder="Search questions or a concept…" value={criteria.search} maxLength={1000} onChange={event => updateCriteria({ search: event.target.value })} /></label>
      <label><span className="sr-only">Practice mode</span><select aria-label="Practice mode" value={criteria.practice} onChange={event => updateCriteria({ practice: event.target.value as Criteria['practice'] })}>
        <option value="scored">Ordinary practice</option><option value="review">Include review questions</option>
      </select></label>
      <label><span className="sr-only">Coverage</span><select aria-label="Coverage" value={criteria.coverage} onChange={event => updateCriteria({ coverage: event.target.value as Criteria['coverage'] })}>
        <option value="linked">Lesson-linked</option><option value="all">All coverage</option><option value="unlinked">Coverage gaps</option>
      </select></label>
    </div>
    <details className="filter-details"><summary>Shape your practice queue <span>{criteria.include_tags.length + criteria.exclude_tags.length + criteria.include_flags.length + criteria.exclude_flags.length + criteria.topics.length > 0 ? '· filters active' : '· tags, flags & progress'}</span></summary>
      <div className="topic-checks">{catalogue.topics.map(topic => <label className="check-label" key={topic.id}><input type="checkbox" checked={criteria.topics.includes(topic.id)} onChange={() => updateCriteria({ topics: criteria.topics.includes(topic.id) ? criteria.topics.filter(id => id !== topic.id) : [...criteria.topics, topic.id] })} />{shortTitle(topic.id)}</label>)}</div>
      <div className="filter-grid">
        <TokenInput label="Include tags" values={criteria.include_tags} onChange={include_tags => updateCriteria({ include_tags })} />
        <TokenInput label="Exclude tags" values={criteria.exclude_tags} onChange={exclude_tags => updateCriteria({ exclude_tags })} />
        <TokenInput label="Include flags" values={criteria.include_flags} onChange={include_flags => updateCriteria({ include_flags })} />
        <TokenInput label="Exclude flags" values={criteria.exclude_flags} onChange={exclude_flags => updateCriteria({ exclude_flags })} />
        <label>Attempt status<select value={criteria.attempted} onChange={event => updateCriteria({ attempted: event.target.value as Criteria['attempted'] })}><option value="all">Any attempt status</option><option value="new">Not attempted</option><option value="attempted">Attempted</option><option value="incorrect">Latest ordinary answer incorrect</option></select></label>
        <label>Lesson status<select value={criteria.read} onChange={event => updateCriteria({ read: event.target.value as Criteria['read'] })}><option value="all">Read or unread</option><option value="read">Read</option><option value="unread">Unread</option></select></label>
      </div>
      <div className="control-row"><label className="check-label"><input type="checkbox" checked={criteria.include_deferred} onChange={event => updateCriteria({ include_deferred: event.target.checked })} />Include deferred questions</label>
        <button className="text-button" onClick={reset}><RotateCcw size={14} /> Reset filters</button></div>
      <p className="muted small">Any included label can match; different fields combine. Exclusions win. Practice filters keep the full reading roadmap available. Review questions do not count toward the ordinary score.</p>
    </details>
  </div>;
}

export function BackupDialog({ catalogue, profile, update, navigate, saving }: {
  catalogue: Catalogue; profile: Profile; update: Update; navigate: (route: string) => void; saving: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState<Backup>();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const summary = pending ? backupSummary(pending.profile, catalogue) : undefined;
  function download() {
    const blob = new Blob([JSON.stringify(makeBackup(profile, catalogue.content_version), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `network-study-${new Date().toISOString().slice(0, 10)}.json`;
    link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Backup downloaded. Keep it somewhere you can find again.');
  }
  return <><button className="backup-button" onClick={() => dialog.current?.showModal()}><Download size={16} /> Backup & restore</button>
    <dialog ref={dialog} className="backup-dialog" aria-labelledby="backup-title">
      <div className="dialog-heading"><h2 id="backup-title">Keep your place.</h2><button className="icon-button" aria-label="Close backup" onClick={() => dialog.current?.close()}><X /></button></div>
      <p>Your progress, attempts, tags, and flags stay in this browser at <strong>{location.origin}</strong>. Export a backup before changing browsers or clearing browser data.</p>
      <button className="button primary" onClick={download} disabled={saving}><Download size={16} /> Download personal backup</button>
      <hr /><h3>Restore a backup</h3><p className="muted">Preview the file first. Restoring replaces your current personal study data; the course stays unchanged.</p>
      <label className="button secondary upload"><Upload size={16} /> Choose backup file<input type="file" accept=".json,application/json" aria-label="Choose backup file" onChange={async event => {
        const file = event.target.files?.[0]; setPending(undefined); setError(''); setMessage('');
        if (file) try {
          if (file.size > 20_000_000) throw new Error('The backup is too large (maximum 20 MB).');
          setPending(parseBackup(await file.text()));
        } catch (reason) { setError(reason instanceof Error ? reason.message : 'Cannot read this backup.'); }
        event.target.value = '';
      }} /></label>
      {error && <p className="notice danger" role="alert">{error}</p>}
      {pending && summary && <div className="restore-preview">
        <h3>Backup from {new Date(pending.exported_at).toLocaleString()}</h3>
        <p>{Object.values(pending.profile.lessons).filter(item => item.read_at).length} lessons marked read · {pending.profile.attempts.length} attempts · {Object.keys(pending.profile.annotations).length} annotated items</p>
        <p className="small">This will replace your current {profile.attempts.length} attempts and {Object.values(profile.lessons).filter(item => item.read_at).length} read marks. Download a backup above if you want to keep them.</p>
        {pending.content_version !== catalogue.content_version && <p className="notice">The course has changed since this backup. Earlier attempts keep their original answer-key snapshots.</p>}
        <p className="small">Unmatched lessons: {summary.unmatchedLessons.length}; unmatched annotations: {summary.unmatchedAnnotations.length}; historical or unmatched attempts: {summary.historicalAttempts.length}. These records will be retained.</p>
        <button className="button primary" disabled={busy || saving} onClick={async () => {
          setBusy(true);
          if (await update(() => pending.profile)) {
            setPending(undefined); setMessage('Backup restored. Your study data is saved in this browser.');
            navigate(pending.profile.current_route);
          }
          else setError('The restore could not be saved. Your previous data is unchanged.');
          setBusy(false);
        }}>Replace personal data with this backup</button>
      </div>}
      {message && <p role="status" className="notice success">{message}</p>}
    </dialog></>;
}

export function shortTitle(topicId: string) {
  return ({ '01_routing': 'Internet routing', '02_dns': 'DNS', '03_ipv6': 'IPv6', '04_tcp': 'TCP', '05_socket_api': 'Socket API', '06_sdn': 'SDN' } as Record<string, string>)[topicId] ?? topicId;
}
