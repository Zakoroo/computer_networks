import { useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Update } from './Controls';
import type { Profile } from './types';

export default function Comments({ kind, id, profile, update }: {
  kind: 'lesson' | 'question'; id: string; profile: Profile; update: Update;
}) {
  const key = `${kind}:${id}`;
  const comments = profile.comments[key] ?? [];
  const helpId = useId();
  const input = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function clear() { setDraft(''); setEditing(undefined); setError(''); }

  async function save() {
    const text = draft.trim();
    if (!text || busy) return;
    const now = new Date().toISOString();
    const commentId = editing ?? crypto.randomUUID();
    setBusy(true); setError('');
    const saved = await update(current => {
      const existing = current.comments[key] ?? [];
      if (editing && !existing.some(comment => comment.id === editing)) throw new Error('The comment was removed.');
      const next = editing
        ? existing.map(comment => comment.id === editing ? { ...comment, text, updated_at: now } : comment)
        : [...existing, { id: commentId, text, created_at: now, updated_at: now }];
      return { ...current, comments: { ...current.comments, [key]: next } };
    });
    if (saved) clear();
    else setError('The comment could not be saved. Your draft is still here; try saving again.');
    setBusy(false);
  }

  async function remove(commentId: string) {
    setBusy(true); setError('');
    const saved = await update(current => {
      const comments = { ...current.comments };
      const remaining = (comments[key] ?? []).filter(comment => comment.id !== commentId);
      if (remaining.length) comments[key] = remaining;
      else delete comments[key];
      return { ...current, comments };
    });
    if (saved && editing === commentId) clear();
    if (!saved) setError('The comment could not be deleted. Try again.');
    setBusy(false);
  }

  return <section className="comments" aria-label={`Comments on ${kind} ${id}`}>
    <details>
      <summary>
        <span>Comments{comments.length > 0 ? ` (${comments.length})` : ''}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <p className="comments-help" id={helpId}>Saved with your study data in this browser and included in your personal backup.</p>
      {comments.map((comment, index) => <article className="comment" key={comment.id} aria-label={`${kind} comment ${index + 1}`}>
        <p className="comment-text">{comment.text}</p>
        <time dateTime={comment.updated_at}>{comment.updated_at === comment.created_at ? 'Saved' : 'Edited'} {new Date(comment.updated_at).toLocaleString()}</time>
        <div className="control-row">
          <button type="button" className="text-button" disabled={busy} onClick={() => {
            setEditing(comment.id); setDraft(comment.text); setError(''); input.current?.focus();
          }}>Edit</button>
          <button type="button" className="text-button" disabled={busy} onClick={() => void remove(comment.id)}>Delete</button>
        </div>
      </article>)}
      <form className="comment-form" onSubmit={event => { event.preventDefault(); void save(); }}>
        <label>{editing ? 'Edit comment' : 'Add a comment'}
          <textarea ref={input} aria-label={`${kind} comment`} aria-describedby={helpId} rows={4} maxLength={5000}
            placeholder="What is confusing, or what could be explained better?" value={draft} disabled={busy}
            onChange={event => setDraft(event.target.value)} />
        </label>
        <div className="control-row">
          <button className="chip-button" disabled={!draft.trim() || busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Save comment'}</button>
          {editing && <button type="button" className="text-button" disabled={busy} onClick={clear}>Cancel</button>}
          <span className="comment-limit">{draft.length}/5000</span>
        </div>
      </form>
      {error && <p className="notice danger small" role="alert">{error}</p>}
    </details>
  </section>;
}
