import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const sizeClass = size === 'sm' ? '10px 12px' : size === 'lg' ? '14px 18px' : undefined;

  return (
    <button
      className={cn('btn', `btn-${variant}`, className)}
      style={sizeClass ? { padding: sizeClass } : undefined}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Chargement…' : children}
    </button>
  );
}
