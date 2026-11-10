import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';

const controlClasses =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function Input({ className, ref, ...props }: InputProps) {
  return <input ref={ref} className={cn(controlClasses, className)} {...props} />;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement>;
}

export function Select({ className, ref, ...props }: SelectProps) {
  return <select ref={ref} className={cn(controlClasses, 'pr-8', className)} {...props} />;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ className, ref, ...props }: TextareaProps) {
  return <textarea ref={ref} className={cn(controlClasses, 'resize-y leading-relaxed', className)} {...props} />;
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('block text-sm font-semibold text-slate-800', className)} {...props} />;
}

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ id, label, hint, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (obligatorio)</span>}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
