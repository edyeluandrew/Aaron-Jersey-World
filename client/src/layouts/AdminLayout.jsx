import { Outlet } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface-light">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Outlet context={{ setTitle: () => {} }} />
        </div>
      </div>
    </div>
  );
}

export function AdminPage({ title, description, actions, children }) {
  return (
    <>
      <AdminHeader title={title} actions={actions} />
      <main className="flex-1 px-4 py-6 lg:px-8">
        {description && <p className="mb-6 max-w-3xl text-sm text-text-muted">{description}</p>}
        {children}
      </main>
    </>
  );
}
