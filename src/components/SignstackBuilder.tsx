import { useMemo, useState } from 'react';
import { SignstackElement, type EventHandler } from '../SignstackElement';
import { useEmbedToken } from '../useEmbedToken';

const KINDS = ['blueprint', 'template', 'schema', 'asset', 'jsonata_function'] as const;
type ResourceKind = (typeof KINDS)[number];

type EditorEvent =
  | { type: 'saved'; detail: unknown }
  | { type: 'published'; detail: unknown }
  | { type: 'error'; detail: unknown };

export function SignstackBuilder() {
  const [resourceKey, setResourceKey] = useState('');
  const [resourceKind, setResourceKind] = useState<ResourceKind>('blueprint');
  const [version, setVersion] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [event, setEvent] = useState<EditorEvent | null>(null);
  const { token, status, mint, reset } = useEmbedToken();

  const onLoad = async () => {
    reset();
    setEvent(null);
    try {
      await mint({
        component: 'builder',
        resourceKey,
        resourceKind,
        ...(version ? { version } : {}),
      });
      setLoaded(true);
    } catch {
      /* status already set */
    }
  };

  const onReset = () => {
    reset();
    setLoaded(false);
    setEvent(null);
  };

  const events = useMemo<Record<string, EventHandler>>(
    () => ({
      saved: (e) => setEvent({ type: 'saved', detail: (e as CustomEvent).detail }),
      published: (e) => setEvent({ type: 'published', detail: (e as CustomEvent).detail }),
      error: (e) => setEvent({ type: 'error', detail: (e as CustomEvent).detail }),
    }),
    []
  );

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <h2>Builder</h2>
          <span className="tag">signstack-builder</span>
        </div>
        <div className="panel-body">
          <div className="row">
            <label htmlFor="editor-resource-key">Resource key</label>
            <input
              id="editor-resource-key"
              className="mono"
              value={resourceKey}
              onChange={(e) => setResourceKey(e.target.value)}
            />
          </div>
          <div className="row">
            <label htmlFor="editor-resource-kind">Resource kind</label>
            <select
              id="editor-resource-kind"
              value={resourceKind}
              onChange={(e) => setResourceKind(e.target.value as ResourceKind)}
            >
              {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div className="row">
            <label htmlFor="editor-version">Version</label>
            <input
              id="editor-version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="optional — defaults to draft"
            />
          </div>
          {event && (
            <div className="event-row">
              Event: <code>{JSON.stringify(event)}</code>
            </div>
          )}
        </div>
        <div className="panel-footer">
          <div className="actions">
            <button className="btn btn-primary" onClick={onLoad} disabled={!resourceKey}>Load editor</button>
            <button className="btn btn-ghost" onClick={onReset}>Reset</button>
          </div>
          {status.message && (
            <div className={`status${status.error ? ' error' : ''}`}>
              <span className="material-icons-outlined">{status.error ? 'error' : 'check_circle'}</span>
              {status.message}
            </div>
          )}
        </div>
      </section>

      <div className="embed-area">
        {token && loaded ? (
          <SignstackElement
            key={token}
            tag="signstack-builder"
            attributes={{
              'embed-token': token,
            }}
            events={events}
          />
        ) : (
          <p className="embed-placeholder">Editor will render here once loaded.</p>
        )}
      </div>
    </>
  );
}
