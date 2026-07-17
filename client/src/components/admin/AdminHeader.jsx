import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader({ title, actions }) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border-light bg-white">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="text-sm text-text-muted">Admin dashboard</p>
          <h1 className="text-2xl md:text-3xl">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <div className="text-right text-sm">
            <p className="font-semibold text-brand-black">{user?.fullName}</p>
            <p className="text-text-muted">{user?.role?.replaceAll('_', ' ')}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
          <Link to="/" className="text-sm font-semibold text-brand-red hover:underline">
            View site
          </Link>
        </div>
      </div>
    </header>
  );
}
