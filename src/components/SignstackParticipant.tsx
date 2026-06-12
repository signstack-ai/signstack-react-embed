import { useMemo, useState } from 'react';
import { SignstackElement, type EventHandler } from '../SignstackElement';
import { useEmbedToken } from '../useEmbedToken';

type SigningEvent =
  | { type: 'signed'; detail: unknown }
  | { type: 'declined'; detail: unknown }
  | { type: 'error'; detail: unknown }
  | { type: 'expired' }
  | { type: 'closed' };

export function SignstackParticipant() {
  const [workflowId, setWorkflowId] = useState('');
  const [stepKey, setStepKey] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [event, setEvent] = useState<SigningEvent | null>(null);
  const { token, status, mint, reset } = useEmbedToken();

  const onLoad = async () => {
    reset();
    setEvent(null);
    try {
      await mint({ component: 'participant', workflowId, stepKey });
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
      signed: (e) => setEvent({ type: 'signed', detail: (e as CustomEvent).detail }),
      declined: (e) => setEvent({ type: 'declined', detail: (e as CustomEvent).detail }),
      signingError: (e) => setEvent({ type: 'error', detail: (e as CustomEvent).detail }),
      sessionExpired: () => setEvent({ type: 'expired' }),
      closed: () => setEvent({ type: 'closed' }),
    }),
    []
  );

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <h2>Participant</h2>
          <span className="tag">signstack-participant</span>
        </div>
        <div className="panel-body">
          <div className="row">
            <label htmlFor="signing-workflow-id">Workflow ID</label>
            <input id="signing-workflow-id" value={workflowId} onChange={(e) => setWorkflowId(e.target.value)} />
          </div>
          <div className="row">
            <label htmlFor="signing-step-key">Step key</label>
            <input
              id="signing-step-key"
              value={stepKey}
              onChange={(e) => setStepKey(e.target.value)}
              placeholder="e.g. customer_sign"
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
            <button className="btn btn-primary" onClick={onLoad} disabled={!workflowId || !stepKey}>Start signing session</button>
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
            tag="signstack-participant"
            attributes={{
              'embed-token': token,
            }}
            events={events}
          />
        ) : (
          <p className="embed-placeholder">Signing session will render here once loaded.</p>
        )}
      </div>
    </>
  );
}
