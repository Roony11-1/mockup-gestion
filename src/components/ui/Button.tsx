import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'subtle'
  | 'success'
  | 'inverse'
  | 'onDark';
type Size = 'sm' | 'md';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-brand-ink shadow-[var(--shadow-sm)] hover:bg-brand-strong active:brightness-95 disabled:bg-brand/40 disabled:text-brand-ink/60',
  secondary:
    'border border-line bg-surface text-ink-soft shadow-[var(--shadow-sm)] hover:border-line-strong hover:bg-surface-2 active:bg-surface-3 disabled:text-muted',
  ghost: 'text-muted hover:bg-surface-2 hover:text-ink active:bg-surface-3 disabled:text-muted/50',
  danger:
    'bg-danger text-danger-contrast shadow-[var(--shadow-sm)] hover:bg-danger-strong active:brightness-95 disabled:opacity-45',
  subtle: 'bg-brand-soft text-brand hover:bg-brand/12 active:bg-brand/18 disabled:text-muted',
  success:
    'bg-success text-success-contrast shadow-[var(--shadow-sm)] hover:bg-success-strong active:brightness-95 disabled:opacity-45',
  inverse:
    'bg-inverse-surface text-inverse-ink shadow-[var(--shadow-sm)] hover:bg-inverse-hover active:brightness-95 disabled:opacity-50',
  onDark:
    'border border-sidebar-line bg-sidebar-ink/10 text-sidebar-ink hover:bg-sidebar-ink/15 active:bg-sidebar-ink/20 disabled:text-sidebar-muted',
};

const sizeClasses: Record<Size, string> = {
  sm: 'min-h-9 px-3 py-1.5 text-xs',
  md: 'min-h-10 px-4 py-2.5 text-sm',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  target,
  rel,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {children}
    </a>
  );
}
