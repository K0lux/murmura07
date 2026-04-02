import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { notifyMessagesRefresh } from '../../hooks/useMessages';
import { createThread } from '../../services/messages.service';
import { useRoute } from '../../utils/router';

export function NewConversationPage({ embedded = false }: { embedded?: boolean }) {
  const { navigate } = useRoute();
  const [interlocuteurId, setInterlocuteurId] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className={embedded ? 'thread-embedded-panel stack' : 'surface stack'}>
      <div style={{ display: 'grid', gap: 6 }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Nouvelle conversation</h2>
        <p className="muted" style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
          Canal interne Murmura. Le numero, l'email ou l'identifiant externe alimente le contexte relationnel.
        </p>
      </div>

      <Input
        label="Interlocuteur"
        placeholder="Numero, email ou identifiant principal"
        value={interlocuteurId}
        onChange={(event) => setInterlocuteurId(event.target.value)}
        {...(error ? { error } : {})}
      />

      <Input
        label="Contexte associe"
        placeholder="Email, telephone, notes ou precision relationnelle"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
      />

      <div className="muted" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
        Les canaux externes (WhatsApp, SMS, email) passent par le jumeau numerique via Murmuraclaw.
      </div>

      <Button
        loading={loading}
        onClick={async () => {
          if (!interlocuteurId.trim()) {
            setError("L'interlocuteur est obligatoire");
            return;
          }

          setError(null);
          setLoading(true);
          try {
            const thread = await createThread({
              interlocuteurId: interlocuteurId.trim(),
              ...(subject.trim() ? { subject: subject.trim() } : {})
            });
            navigate(`/chat/thread/${thread.id}`);
            setTimeout(() => notifyMessagesRefresh(), 50);
          } catch (threadError) {
            setError(threadError instanceof Error ? threadError.message : 'Creation de la conversation impossible');
          } finally {
            setLoading(false);
          }
        }}
      >
        Ouvrir la conversation
      </Button>
    </div>
  );
}
