import { useThreadPreview } from '../../../stores/thread-preview.store';
import { useRoute } from '../../../utils/router';
import { AlertBanner } from './AlertBanner';
import { AnalysisCard } from './AnalysisCard';
import { AutonomyBadge } from './AutonomyBadge';
import { ReasoningDrawer } from './ReasoningDrawer';
import { SimulationList } from './SimulationList';
import { StrategyCard } from './StrategyCard';
import { SuggestedReplyCard } from './SuggestedReplyCard';

export function AssistantPanel() {
  const { preview } = useThreadPreview();
  const { navigate } = useRoute();

  return (
    <aside className="assistant-shell">
      <div className="assistant-header">
        <div>
          <strong>Panneau intelligent</strong>
          <div className="muted">IA, agent et jumeau numerique dans un panneau dedie.</div>
        </div>
        <AutonomyBadge />
      </div>

      <div className="assistant-scroll">
        {preview ? (
          <section className="assistant-section assistant-preview-card">
            <div className="assistant-section-title">Chargement depuis la liste</div>
            <strong>{preview.name}</strong>
            <p className="muted" style={{ margin: 0 }}>
              {preview.summary}
            </p>
            <div className="assistant-preview-metrics">
              <span>Tension {Math.round(preview.tensionScore * 100)}%</span>
              <span>{preview.relationshipLabel}</span>
            </div>
            <div className="assistant-preview-actions">
              {preview.assistantActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  className="chat-preview-action"
                  onClick={() => {
                    if (action.kind === 'draft-reply') {
                      navigate(`/chat/thread/${preview.threadId}`);
                      return;
                    }

                    if (action.kind === 'digital-twin') {
                      navigate('/intelligence/dashboard');
                    }
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="assistant-section">
          <div className="assistant-section-title">Analyse IA</div>
          <AlertBanner />
          <AnalysisCard />
          <StrategyCard />
        </section>

        <section className="assistant-section">
          <div className="assistant-section-title">Agent Murmura</div>
          <SuggestedReplyCard />
          <ReasoningDrawer />
        </section>

        <section className="assistant-section">
          <div className="assistant-section-title">Jumeau numerique</div>
          <SimulationList />
        </section>
      </div>
    </aside>
  );
}
