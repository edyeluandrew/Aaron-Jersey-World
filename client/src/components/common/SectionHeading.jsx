export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto' : align === 'right' ? 'text-right ml-auto' : '';

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-red">{eyebrow}</p>
      )}
      <h2 className="mb-4">{title}</h2>
      {description && <p className="text-lg text-text-muted">{description}</p>}
    </div>
  );
}
