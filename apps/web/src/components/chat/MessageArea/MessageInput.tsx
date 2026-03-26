import { useState } from 'react';
import { notifyMessagesRefresh, useMessages } from '../../../hooks/useMessages';
import { sendMessage } from '../../../services/messages.service';

export function MessageInput() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeThreadId } = useMessages();

  return (
    <div className="chat-composer-shell">
      {error ? <div className="chat-composer-error">{error}</div> : null}

      <div className="chat-composer-row">
        <textarea
          className="chat-composer-input"
          placeholder="Tapez votre message..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
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
            onClick={async () => {
              if (!activeThreadId || value.trim().length === 0) {
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
            }}
          >
            {loading ? '...' : '>'}
          </button>
        </div>
      </div>
    </div>
  );
}
