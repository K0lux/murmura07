import { useMemo, useState } from 'react';
import { useMessages } from '../../../hooks/useMessages';
import { setThreadPreview } from '../../../stores/thread-preview.store';
import { useRoute } from '../../../utils/router';
import { ThreadItem } from './ThreadItem';
import { ThreadSearch } from './ThreadSearch';
import { EmptyState } from '../../ui/EmptyState';

type FilterKey = 'all' | 'unread' | 'favorites' | 'groups';

export function ThreadList() {
  const { threads } = useMessages();
  const { pathname, navigate } = useRoute();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: 'all', label: 'Tout' },
    { key: 'unread', label: 'Non lu' },
    { key: 'favorites', label: 'Favoris' },
    { key: 'groups', label: 'Groupes' }
  ];

  const filtered = useMemo(
    () =>
      [...threads]
        .filter((thread) => {
          const matchesQuery = `${thread.name} ${thread.lastMessage} ${thread.channel}`
            .toLowerCase()
            .includes(query.toLowerCase());

          if (!matchesQuery) {
            return false;
          }

          switch (activeFilter) {
            case 'unread':
              return thread.unread > 0;
            case 'favorites':
              return thread.tensionScore <= 0.35;
            case 'groups':
              return thread.channel === 'internal';
            default:
              return true;
          }
        })
        .sort((left, right) => {
          if (right.unread !== left.unread) {
            return right.unread - left.unread;
          }

          return right.lastMessageAt.localeCompare(left.lastMessageAt);
        }),
    [activeFilter, query, threads]
  );

  return (
    <section className="thread-list-shell">
      <div className="thread-list-header">
        <div className="thread-list-heading">
          <h2>Discussions</h2>
        </div>
        <button type="button" className="thread-create-button" onClick={() => navigate('/chat/new')}>
          <span>+</span>
        </button>
      </div>

      <ThreadSearch onSearch={setQuery} />

      <div className="thread-filter-row">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={activeFilter === filter.key ? 'thread-filter-chip active' : 'thread-filter-chip'}
            onClick={() => setActiveFilter(filter.key)}
          >
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      <div className="thread-list-scroll">
        {filtered.length === 0 ? (
          <div className="thread-empty-shell">
            <EmptyState
              title="Aucune conversation"
              description="Aucune discussion ne correspond a vos filtres ou a votre recherche actuelle."
            />
          </div>
        ) : (
          filtered.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              active={pathname === `/chat/thread/${thread.id}`}
              onSelect={(id) => {
                setThreadPreview(null);
                navigate(`/chat/thread/${id}`);
              }}
              onInspect={(preview) => setThreadPreview(preview)}
            />
          ))
        )}
      </div>
    </section>
  );
}
