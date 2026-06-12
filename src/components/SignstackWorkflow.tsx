import { useState } from 'react';
import { SignstackElement } from '../SignstackElement';
import { useEmbedToken } from '../useEmbedToken';

export function SignstackWorkflow() {
  const [workflowId, setWorkflowId] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { token, status, mint, reset } = useEmbedToken();

  const onLoad = async () => {
    reset();
    try {
      await mint({ component: 'workflow', workflowId });
      setLoaded(true);
    } catch {
      /* status already set */
    }
  };

  const onReset = () => {
    reset();
    setLoaded(false);
  };

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <h2>Workflow</h2>
          <span className="tag">signstack-workflow</span>
        </div>
        <div className="panel-body">
          <div className="row">
            <label htmlFor="workflow-id">Workflow ID</label>
            <input id="workflow-id" value={workflowId} onChange={(e) => setWorkflowId(e.target.value)} />
          </div>
        </div>
        <div className="panel-footer">
          <div className="actions">
            <button className="btn btn-primary" onClick={onLoad} disabled={!workflowId}>Load workflow</button>
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
            tag="signstack-workflow"
            attributes={{
              'embed-token': token,
            }}
          />
        ) : (
          <p className="embed-placeholder">Component will render here once loaded.</p>
        )}
      </div>
    </>
  );
}
