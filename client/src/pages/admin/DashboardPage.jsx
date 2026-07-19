import { useQuery } from '@tanstack/react-query';
import { AdminPage } from '@/layouts/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import DashboardNotifications from '@/components/admin/DashboardNotifications';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorState from '@/components/common/ErrorState';
import { ADMIN_QUERY_KEYS } from '@/constants/adminNavigation';
import { fetchDashboardStats } from '@/services/adminDashboard';

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard,
    queryFn: fetchDashboardStats,
  });

  return (
    <AdminPage title="Dashboard">
      {isLoading && <LoadingSpinner label="Loading dashboard..." />}
      {isError && <ErrorState onRetry={refetch} />}

      {data && (
        <>
          <DashboardNotifications
            notifications={data.notifications}
            count={data.notificationCount}
          />

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Total products" value={data.totalProducts} hint={`${data.activeProducts} active`} to="/admin/products" />
          <StatsCard label="Out of stock" value={data.outOfStockProducts} to="/admin/products" />
          <StatsCard label="New inquiries" value={data.newInquiries} to="/admin/inquiries" />
          <StatsCard label="Pending quotes" value={data.pendingQuotes} to="/admin/quotes" />
          <StatsCard label="Branding requests" value={data.brandingRequests} to="/admin/branding" />
          <StatsCard label="Institutional requests" value={data.institutionalRequests} to="/admin/institutional" />
          </div>
        </>
      )}
    </AdminPage>
  );
}
