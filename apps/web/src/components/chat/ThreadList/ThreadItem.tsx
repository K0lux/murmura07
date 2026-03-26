import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { formatRelativeTime, truncate } from '../../../utils/format';
import type { ThreadPreviewState } from '../../../stores/thread-preview.store';

export type ThreadListItem = {
  id: string;
  name: string;
  channel: string;
  lastMessage: string;
  lastMessageAt: string;
  tensionScore: number;
  unread: number;
};

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
      return 'Conversation';
  }
}

function getChannelLabel(channel: string) {
  switch (channel) {
    case 'internal':
      return 'Interne';
    case 'email':
      return 'Email';
    case 'whatsapp':
      return 'WhatsApp';
    case 'telegram':
      return 'Telegram';
    case 'sms':
      return 'SMS';
    default:
      return channel;
  }
}

function buildThreadPreview(thread: ThreadListItem): ThreadPreviewState {
  const relationshipLabel = getRelationshipLabel(thread.channel);
  const summary =
    thread.tensionScore > 0.7
      ? 'Conversation sensible. Mieux vaut clarifier et temporiser avant une action externe.'
      : thread.tensionScore > 0.35
        ? 'Conversation a suivre. Murmura peut aider a structurer la prochaine reponse.'
        : 'Conversation stable. Les actions de suivi sont simples a preparer.';

  return {
    threadId: thread.id,
    name: thread.name,
    channel: thread.channel,
    lastMessage: thread.lastMessage,
    tensionScore: thread.tensionScore,
    unread: thread.unread,
    relationshipLabel,
    summary,
    messageActions: [
      { id: 'open-thread', label: 'Ouvrir la conversation', target: 'message', kind: 'open-thread' },
      { id: 'memory', label: 'Voir la memoire associee', target: 'message', kind: 'memory' },
      { id: 'relationships', label: 'Voir les relations', target: 'message', kind: 'relationships' }
    ],
    assistantActions: [
      { id: 'draft-reply', label: 'Preparer une reponse', target: 'assistant', kind: 'draft-reply' },
      { id: 'digital-twin', label: 'Simuler via le jumeau numerique', target: 'assistant', kind: 'digital-twin' }
    ]
  };
}

export function ThreadItem({
  thread,
  active,
  onSelect,
  onInspect
}: {
  thread: ThreadListItem;
  active: boolean;
  onSelect: (id: string) => void;
  onInspect: (preview: ThreadPreviewState) => void;
}) {
  const tensionLabel =
    thread.tensionScore > 0.7 ? 'Tension haute' : thread.tensionScore > 0.35 ? 'A suivre' : 'Fluide';

  return (
    <button
      type="button"
      className={active ? 'thread-card active' : 'thread-card'}
      onClick={() => onSelect(thread.id)}
    >
      <div className="thread-card-avatar">
        <Avatar name={thread.name} size="lg" />
        <span className="thread-presence-dot" />
      </div>

      <div className="thread-card-body">
        <div className="thread-card-topline">
          <strong>{thread.name}</strong>
          <span className="thread-card-time">{formatRelativeTime(thread.lastMessageAt)}</span>
        </div>

        <div className="thread-card-preview">{truncate(thread.lastMessage, 72)}</div>

        <div className="thread-card-signals">
          <span className="thread-channel-pill">{getChannelLabel(thread.channel)}</span>
          <span className="thread-tension-indicator">
            <span className="thread-tension-track">
              <span
                className="thread-tension-fill"
                style={{ width: `${Math.max(8, Math.round(thread.tensionScore * 100))}%` }}
              />
            </span>
            <span>{tensionLabel}</span>
          </span>
        </div>

        <div className="thread-card-meta">
          <Badge tone={thread.tensionScore > 0.7 ? 'warning' : 'neutral'}>
            {getRelationshipLabel(thread.channel)}
          </Badge>
          <div className="thread-card-rightmeta">
            <button
              type="button"
              className="thread-inspect-button"
              onClick={(event) => {
                event.stopPropagation();
                onInspect(buildThreadPreview(thread));
              }}
            >
              Actions
            </button>
            {thread.unread > 0 ? <span className="thread-unread-badge">{thread.unread}</span> : null}
          </div>
        </div>
      </div>
    </button>
  );
}
