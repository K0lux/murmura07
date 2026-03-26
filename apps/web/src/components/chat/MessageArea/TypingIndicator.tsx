export function TypingIndicator({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return <div className="muted">Votre interlocuteur est en train d’ecrire…</div>;
}
