import { useEffect, useState } from 'react';
import { Input } from '../../ui/Input';

export function ThreadSearch({
  onSearch
}: {
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => onSearch(value), 180);
    return () => window.clearTimeout(timeoutId);
  }, [onSearch, value]);

  return (
    <div className="thread-search">
      <Input
        placeholder="Rechercher un contact, un message..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
