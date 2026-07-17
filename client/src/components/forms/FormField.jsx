import { errorClassName, labelClassName } from '@/constants/forms';

export function FormField({ label, htmlFor, error, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className={labelClassName}>
          {label}
          {required && <span className="text-brand-red"> *</span>}
        </label>
      )}
      {children}
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return <p className={errorClassName}>{message}</p>;
}
