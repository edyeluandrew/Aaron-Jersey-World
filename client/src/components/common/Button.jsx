import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-brand-red text-white hover:bg-brand-red-dark focus-visible:outline-brand-red disabled:bg-brand-red/50',
  secondary:
    'border border-brand-black bg-white text-brand-black hover:bg-surface-light focus-visible:outline-brand-red disabled:opacity-50',
  ghost: 'text-brand-black hover:bg-surface-light focus-visible:outline-brand-red disabled:opacity-50',
  gold: 'bg-brand-gold text-brand-black hover:bg-brand-gold-dark focus-visible:outline-brand-gold disabled:opacity-50',
};

const sizes = {
  sm: 'min-h-[36px] px-4 py-2 text-sm',
  md: 'min-h-[44px] px-6 py-2.5 text-base',
  lg: 'min-h-[48px] px-8 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  to,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-button font-semibold transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${sizes[size]} ${className}`;

  const content = isLoading ? (
    <>
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />
      <span>Loading...</span>
    </>
  ) : (
    children
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled || isLoading} className={classes} {...props}>
      {content}
    </button>
  );
}
