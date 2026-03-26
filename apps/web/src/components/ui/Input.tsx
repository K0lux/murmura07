import { forwardRef, type InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, ...props },
  ref
) {
  return (
    <label className="stack">
      {label ? <span>{label}</span> : null}
      <input ref={ref} className="input" {...props} />
      {error ? <span style={{ color: 'var(--danger)' }}>{error}</span> : null}
    </label>
  );
});
