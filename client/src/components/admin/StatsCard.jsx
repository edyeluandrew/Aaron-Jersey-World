import { Link } from 'react-router-dom';

export default function StatsCard({ label, value, hint, to }) {
  const content = (
    <div className="rounded-card border border-border-light bg-white p-5 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand-black">{value ?? 0}</p>
      {hint && <p className="mt-2 text-sm text-text-muted">{hint}</p>}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block transition hover:-translate-y-0.5">
        {content}
      </Link>
    );
  }

  return content;
}
