import { useState } from 'react';
import { notifyMessagesRefresh, useMessages } from '../../../hooks/useMessages';
import { sendMessage } from '../../../services/messages.service';

export function MessageInput() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeThreadId } = useMessages();

  const handleSend = async () => {
    if (!activeThreadId || value.trim().length === 0 || loading) {
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await sendMessage(activeThreadId, { content: value.trim() });
      setValue('');
      notifyMessagesRefresh();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Envoi impossible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-composer-shell">
      {error ? <div className="chat-composer-error">{error}</div> : null}

      <div className="chat-composer-row">
        <textarea
          className="chat-composer-input"
          placeholder="Votre message…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSend();
            }
          }}
        />

        <div className="chat-composer-actions">
          <button type="button" className="chat-composer-button" disabled title="Pieces jointes">
            +
          </button>
          <button type="button" className="chat-composer-button" disabled title="Suggestions IA">
            IA
          </button>
          <button
            type="button"
            className="chat-composer-send"
            disabled={loading || !activeThreadId || value.trim().length === 0}
            onClick={() => void handleSend()}
            title="Envoyer (Entrée)"
            aria-label="Envoyer"
          >
            {loading ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" opacity="0.3" />
                <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
