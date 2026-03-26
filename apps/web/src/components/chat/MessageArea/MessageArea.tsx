import { useMessages } from '../../../hooks/useMessages';
import { useThreadPreview } from '../../../stores/thread-preview.store';
import { useRoute } from '../../../utils/router';
import { MessageBubble } from './MessageBubble';
import { MessageDateSeparator } from './MessageDateSeparator';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';

function getRelationshipLabel(channel: string) {
  switch (channel) {
    case 'internal':
      return 'Equipe';
    case 'email':
      return 'Collegue';
    case 'whatsapp':
      return 'Amie proche';
    case 'telegram':
      return 'Contact direct';
    case 'sms':
      return 'Famille';
    default:
      return 'Contact';
  }
}

export function MessageArea() {
  const { activeMessages, typing, activeThread } = useMessages();
  const { preview, clearPreview } = useThreadPreview();
  const { navigate } = useRoute();

  if (!activeThread && !preview) {
    return (
      <section className="chat-main-shell">
        <div className="chat-welcome-state">
          <div className="chat-welcome-mark">M</div>
          <h2>Bienvenue sur Murmura</h2>
          <p>Selectionnez un contact a gauche pour ouvrir une discussion reelle connectee a l'API.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="chat-main-shell">
      <div className="chat-thread-topbar">
        <div className="chat-thread-profile">
          <div className="chat-thread-avatar">
            {(activeThread?.name ?? preview?.name ?? '?').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <strong>{activeThread?.name ?? preview?.name ?? 'Conversation'}</strong>
            <div className="chat-thread-label">
              {getRelationshipLabel(activeThread?.channel ?? preview?.channel ?? 'internal')}
            </div>
          </div>
        </div>
        <button type="button" className="chat-thread-menu">
          ...
        </button>
      </div>

      {preview ? (
        <div className="chat-preview-card">
          <div className="row-between">
            <strong>Informations et actions possibles</strong>
            <button type="button" className="thread-inspect-button subtle" onClick={() => clearPreview()}>
              Fermer
            </button>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            {preview.summary}
          </p>
          <div className="chat-preview-actions">
            {preview.messageActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="chat-preview-action"
                onClick={() => {
                  if (action.kind === 'open-thread') {
                    navigate(`/chat/thread/${preview.threadId}`);
                    clearPreview();
                    return;
                  }

                  if (action.kind === 'memory') {
                    navigate('/intelligence/memory');
                    return;
                  }

                  if (action.kind === 'relationships') {
                    navigate('/intelligence/relationships');
                  }
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="chat-message-canvas">
        {activeThread ? (
          activeMessages.length > 0 ? (
            <>
              <MessageDateSeparator date={activeMessages[0]?.timestamp ?? new Date().toISOString()} />
              {activeMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </>
          ) : (
            <div className="chat-empty-thread">
              <strong>Pas encore de messages</strong>
              <p>Le fil existe deja. Vous pouvez envoyer le premier message quand vous voulez.</p>
            </div>
          )
        ) : (
          <div className="chat-empty-thread">
            <strong>Fiche chargee</strong>
            <p>Les actions de conversation sont maintenant chargees ici depuis la liste de gauche.</p>
          </div>
        )}

        <TypingIndicator visible={typing} />
      </div>

      <div className="chat-context-banner">Contexte actuel: Decontracte</div>

      {activeThread ? <MessageInput /> : null}
    </section>
  );
}
