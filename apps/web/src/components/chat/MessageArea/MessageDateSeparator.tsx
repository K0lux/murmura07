import { formatDate } from '../../../utils/format';

export function MessageDateSeparator({ date }: { date: string }) {
  return (
    <div className="row" style={{ justifyContent: 'center' }}>
      <span className="pill">{formatDate(date)}</span>
    </div>
  );
}
