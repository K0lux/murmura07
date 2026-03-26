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
      <div className="stack" style={{ gap: 8 }}>
        <h2 style={{ margin: 0 }}>Nouvelle conversation Murmura</h2>
        <p className="muted" style={{ margin: 0 }}>
          La conversation est ouverte dans le canal interne de Murmura. Le numero de telephone,
          l'email ou les identifiants externes servent ici a nourrir le contexte relationnel.
        </p>
      </div>

      <Input
        label="Interlocuteur"
        placeholder="Numero, email ou identifiant principal"
        value={interlocuteurId}
        onChange={(event) => setInterlocuteurId(event.target.value)}
      />

      <Input
        label="Contexte associe"
        placeholder="Email, telephone, notes ou precision relationnelle"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        error={error ?? undefined}
      />

      <div className="muted" style={{ fontSize: '0.92rem' }}>
        Les envois vers des canaux externes passent ensuite par le jumeau numerique, qui peut
        appeler Murmuraclaw si vous choisissez d'agir hors de la messagerie interne.
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
              subject: subject.trim() || undefined
            });
            notifyMessagesRefresh();
            navigate(`/chat/thread/${thread.id}`);
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
