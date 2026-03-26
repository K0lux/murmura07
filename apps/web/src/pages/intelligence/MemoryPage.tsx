import { useEffect, useState } from 'react';
import { MemorySearchBar } from '../../components/intelligence/MemorySearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { useMemorySearch } from '../../hooks/useMemorySearch';
import { getMemoryFile, type MemoryFile } from '../../services/memory.service';

export function MemoryPage() {
  const { query, setQuery, results, isLoading, error } = useMemorySearch();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<MemoryFile | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSource(results[0]?.source ?? null);
  }, [results]);

  useEffect(() => {
    if (!selectedSource) {
      setFilePreview(null);
      setPreviewError(null);
      return;
    }

    let cancelled = false;

    const loadFile = async () => {
      try {
        const preview = await getMemoryFile(selectedSource, { startLine: 1, numLines: 40 });
        if (!cancelled) {
          setFilePreview(preview);
          setPreviewError(null);
        }
      } catch (caught) {
        if (!cancelled) {
          setFilePreview(null);
          setPreviewError(caught instanceof Error ? caught.message : 'Lecture memoire impossible.');
        }
      }
    };

    void loadFile();
    return () => {
      cancelled = true;
    };
  }, [selectedSource]);

  return (
    <div className="stack">
      <MemorySearchBar
        query={query}
        onQueryChange={setQuery}
        isLoading={isLoading}
        error={error}
      />
      {!query.trim() ? (
        <EmptyState
          title="Recherche memoire"
          description="Lancez une recherche pour interroger les fichiers memoire indexes par l'API."
        />
      ) : null}
      {query.trim() && !isLoading && !error && results.length === 0 ? (
        <EmptyState
          title="Aucun resultat"
          description="Aucune entree memoire ne correspond encore a cette recherche."
        />
      ) : null}
      {results.length > 0 ? (
        <div className="stack">
          <div className="surface stack">
            <strong>Resultats</strong>
            {results.map((result) => (
              <button
                key={`${result.source}:${result.lineRange.join('-')}`}
                className="card"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => setSelectedSource(result.source)}
              >
                <div className="row-between">
                  <strong>{result.source}</strong>
                  <span className="muted">
                    Lignes {result.lineRange[0]}-{result.lineRange[1]}
                  </span>
                </div>
                <div className="muted">{result.snippet}</div>
              </button>
            ))}
          </div>
          <div className="surface stack">
            <strong>{selectedSource ?? 'Apercu memoire'}</strong>
            {previewError ? <div style={{ color: 'var(--danger)' }}>{previewError}</div> : null}
            {filePreview ? (
              <pre className="surface" style={{ margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                {filePreview.lines.join('\n')}
              </pre>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
