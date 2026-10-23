import { Children, isValidElement, memo, useEffect, useId, useMemo, useRef, useState, type ComponentProps } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Expand, X } from 'lucide-react';
import type { Catalogue } from './types';

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeRaw, rehypeSanitize, rehypeSlug, rehypeKatex];

let mermaidModule: Promise<typeof import('mermaid')['default']> | undefined;
let renderQueue: Promise<unknown> = Promise.resolve();
function getMermaid() {
  mermaidModule ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false, securityLevel: 'strict', theme: 'base', suppressErrorRendering: true,
      fontFamily: 'Arial, sans-serif',
      themeVariables: { primaryColor: '#edf4f0', primaryTextColor: '#203b38', primaryBorderColor: '#789a90',
        lineColor: '#567c73', secondaryColor: '#fbefd9', tertiaryColor: '#f7f6f0', fontSize: '15px' },
    });
    return mermaid;
  });
  return mermaidModule;
}

function Diagram({ source }: { source: string }) {
  const id = useId().replace(/[^a-z0-9]/gi, '');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let active = true;
    setSvg(''); setError('');
    const job = renderQueue.then(async () => {
      if (!active) return;
      const mermaid = await getMermaid();
      const result = await mermaid.render(`diagram-${id}`, source);
      if (active) setSvg(result.svg);
    }).catch(() => {
      if (active) setError('This diagram could not be drawn. The original Mermaid source is available below.');
    });
    renderQueue = job;
    return () => { active = false; };
  }, [source, id]);
  return <figure className="diagram" data-status={error ? 'error' : svg ? 'ready' : 'loading'}>
    <div className="figure-toolbar"><span>Concept diagram</span>
      {svg && <button className="text-button" onClick={() => dialog.current?.showModal()} aria-label="Enlarge diagram"><Expand size={15} /> Enlarge</button>}
    </div>
    {svg ? <div className="diagram-viewport" dangerouslySetInnerHTML={{ __html: svg }} />
      : <p role="status">{error || 'Drawing diagram…'}</p>}
    {error && <details><summary>Diagram source</summary><pre>{source}</pre></details>}
    <dialog ref={dialog} className="diagram-dialog" aria-label="Enlarged diagram" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="dialog-heading"><span>Diagram · scroll to explore</span><button autoFocus className="icon-button" aria-label="Close diagram" onClick={() => dialog.current?.close()}><X /></button></div>
      <div className="diagram-full" dangerouslySetInnerHTML={{ __html: svg }} />
    </dialog>
  </figure>;
}

export function contentRoute(href: string, origin: string, catalogue: Catalogue): string | null {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return null;
  const url = new URL(href, `https://course.local/${origin}`);
  const path = decodeURIComponent(url.pathname.slice(1));
  const anchor = url.hash ? `?anchor=${encodeURIComponent(decodeURIComponent(url.hash.slice(1)))}` : '';
  const lesson = catalogue.lessons.find(item => item.path === path);
  if (lesson) return `/lesson/${lesson.id}${anchor}`;
  if (path.startsWith('quizzes/')) return '/library';
  if (Object.hasOwn(catalogue.documents, path)) return `/doc/${encodeURIComponent(path)}${anchor}`;
  return null;
}

// Keep renderer component types stable: redefining them during a progress save
// remounts the diagram subtree, discarding its SVG and changing the page height.
function MarkdownPre({ children }: ComponentProps<'pre'>) {
  const child = Children.toArray(children)[0];
  if (isValidElement<{ className?: string; children?: unknown }>(child)
    && child.props.className?.includes('language-mermaid')) {
    return <Diagram source={String(child.props.children ?? '').trimEnd()} />;
  }
  return <pre>{children}</pre>;
}

function MarkdownTable({ children }: ComponentProps<'table'>) {
  return <div className="table-scroll"><table>{children}</table></div>;
}

function Markdown({ text, origin, catalogue, navigate }: {
  text: string; origin: string; catalogue: Catalogue; navigate: (route: string) => void;
}) {
  const components = useMemo<Components>(() => ({
    a({ href = '', children, node: _node, ...props }) {
      const route = contentRoute(href, origin, catalogue);
      const external = /^https?:\/\//i.test(href);
      if (!route && !external && !href.startsWith('mailto:')) {
        return <span className="unavailable-link" title="This repository reference is not included in the study reader.">{children}</span>;
      }
      return <a {...props} href={route ? `#${route}` : href} target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined} onClick={event => {
          if (route && !event.ctrlKey && !event.metaKey && !event.shiftKey) { event.preventDefault(); navigate(route); }
        }}>{children}</a>;
    },
    pre: MarkdownPre,
    table: MarkdownTable,
  }), [origin, catalogue, navigate]);
  return <div className="markdown"><ReactMarkdown
    remarkPlugins={remarkPlugins}
    rehypePlugins={rehypePlugins}
    components={components}
  >{text}</ReactMarkdown></div>;
}

export default memo(Markdown);
