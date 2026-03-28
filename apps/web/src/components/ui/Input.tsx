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
    <label className="input-group">
      {label ? <span className="input-label">{label}</span> : null}
      <input ref={ref} className="input" {...props} />
      {error ? <span className="input-error">{error}</span> : null}
    </label>
  );
});
