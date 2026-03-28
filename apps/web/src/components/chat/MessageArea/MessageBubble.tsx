export type Message = {
  id: string;
  author: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  channel: string;
};

export function MessageBubble({ message }: { message: Message }) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <article className={message.author === 'outbound' ? 'message-bubble outbound' : 'message-bubble'}>
      <p>{message.content}</p>
      <div className="message-bubble-meta">
        <span>{formattedTime}</span>
      </div>
    </article>
  );
}
