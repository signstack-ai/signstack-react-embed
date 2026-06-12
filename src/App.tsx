import { useState, type ReactNode } from 'react';
import { SignstackBuilder } from './components/SignstackBuilder';
import { SignstackWorkflow } from './components/SignstackWorkflow';
import { SignstackParticipant } from './components/SignstackParticipant';

type TabId = 'builder' | 'workflow' | 'participant';

const TAB_LABELS: Record<TabId, string> = {
  builder: 'Builder',
  workflow: 'Workflow',
  participant: 'Participant',
};

const TAB_ORDER: readonly TabId[] = ['builder', 'workflow', 'participant'];

function renderTab(tab: TabId): ReactNode {
  switch (tab) {
    case 'builder':
      return <SignstackBuilder />;
    case 'workflow':
      return <SignstackWorkflow />;
    case 'participant':
      return <SignstackParticipant />;
  }
}

export function App() {
  const [tab, setTab] = useState<TabId>('builder');

  return (
    <>
      <header className="page-header">
        <div className="logo" aria-hidden="true">
          <span className="material-icons-outlined">description</span>
        </div>
        <div>
          <h1>SignStack Web Components — React</h1>
          <p className="subtitle">Paste a workflow or resource, mint an embed token, mount the component.</p>
        </div>
      </header>

      <nav className="tabs">
        {TAB_ORDER.map((id) => (
          <button key={id} className={id === tab ? 'active' : ''} onClick={() => setTab(id)}>
            {TAB_LABELS[id]}
          </button>
        ))}
      </nav>

      {renderTab(tab)}
    </>
  );
}
