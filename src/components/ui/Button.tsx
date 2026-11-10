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
    'bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900 disabled:bg-brand-300',
  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 disabled:text-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-300',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800 disabled:bg-red-300',
  subtle: 'bg-brand-50 text-brand-800 hover:bg-brand-100 active:bg-brand-200 disabled:text-brand-300',
  success:
    'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-300',
  inverse:
    'bg-white text-brand-900 shadow-sm hover:bg-brand-50 active:bg-brand-100 disabled:bg-white/60',
  onDark:
    'border border-white/25 bg-white/5 text-white hover:bg-white/10 active:bg-white/15 disabled:text-white/40',
};

const sizeClasses: Record<Size, string> = {
  sm: 'min-h-9 px-3 py-1.5 text-xs',
  md: 'min-h-10 px-4 py-2.5 text-sm',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed',
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
