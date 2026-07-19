import { Link } from 'react-router-dom';
import { AlertCircle, Bell, CheckCircle2, Info } from 'lucide-react';

const TYPE_STYLES = {
  warning: {
    container: 'border-warning/30 bg-warning/5',
    icon: AlertCircle,
    iconClass: 'text-warning',
  },
  info: {
    container: 'border-brand-red/20 bg-brand-red/5',
    icon: Info,
    iconClass: 'text-brand-red',
  },
  success: {
    container: 'border-success/30 bg-success/5',
    icon: CheckCircle2,
    iconClass: 'text-success',
  },
};

function NotificationItem({ notification }) {
  const style = TYPE_STYLES[notification.type] || TYPE_STYLES.info;
  const Icon = style.icon;

  const content = (
    <div className={`flex gap-3 rounded-card border p-4 ${style.container}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClass}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-semibold text-brand-black">{notification.title}</p>
        <p className="mt-1 text-sm text-text-muted">{notification.message}</p>
      </div>
    </div>
  );

  if (notification.href) {
    return (
      <Link to={notification.href} className="block transition hover:-translate-y-0.5">
        {content}
      </Link>
    );
  }

  return content;
}

export default function DashboardNotifications({ notifications = [], count = 0 }) {
  if (!notifications.length) {
    return (
      <section className="mb-8 rounded-card border border-success/30 bg-success/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
          <div>
            <h2 className="font-heading text-xl tracking-wide text-brand-black">NOTIFICATIONS</h2>
            <p className="mt-1 text-sm text-text-muted">You are all caught up. No pending actions right now.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 rounded-card border border-border-light bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10">
          <Bell className="h-5 w-5 text-brand-red" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-heading text-xl tracking-wide text-brand-black">NOTIFICATIONS</h2>
          <p className="text-sm text-text-muted">
            {count} item{count === 1 ? '' : 's'} need your attention
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <NotificationItem notification={notification} />
          </li>
        ))}
      </ul>
    </section>
  );
}
