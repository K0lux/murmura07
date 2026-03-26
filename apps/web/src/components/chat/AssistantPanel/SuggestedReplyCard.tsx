import { useAnalysis } from '../../../hooks/useAnalysis';

export function SuggestedReplyCard() {
  const { recommendation } = useAnalysis();
  const suggestedReply = recommendation?.suggestedReply?.trim();

  if (!suggestedReply) {
    return null;
  }

  return (
    <div className="card stack">
      <strong>Message suggere</strong>
      <p style={{ margin: 0 }}>{suggestedReply}</p>
    </div>
  );
}
