import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import NotFoundPage from '@/pages/public/NotFoundPage';

const HomePage = lazy(() => import('@/pages/public/HomePage'));
const ProductsPage = lazy(() => import('@/pages/public/ProductsPage'));
const AllProductsPage = lazy(() => import('@/pages/public/AllProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'));
const CategoryPage = lazy(() => import('@/pages/public/CategoryPage'));
const SearchPage = lazy(() => import('@/pages/public/SearchPage'));
const CustomBrandingPage = lazy(() => import('@/pages/public/CustomBrandingPage'));
const InstitutionsPage = lazy(() => import('@/pages/public/InstitutionsPage'));
const TrophiesAwardsPage = lazy(() => import('@/pages/public/TrophiesAwardsPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));
const RequestQuotePage = lazy(() => import('@/pages/public/RequestQuotePage'));
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/public/TermsPage'));

const AdminLoginPage = lazy(() => import('@/pages/auth/AdminLoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const ProductListPage = lazy(() => import('@/pages/admin/ProductListPage'));
const ProductFormPage = lazy(() => import('@/pages/admin/ProductFormPage'));
const CategoryListPage = lazy(() => import('@/pages/admin/CategoryListPage'));
const CategoryFormPage = lazy(() => import('@/pages/admin/CategoryFormPage'));
const BannerListPage = lazy(() => import('@/pages/admin/BannerListPage'));
const BannerFormPage = lazy(() => import('@/pages/admin/BannerFormPage'));
const RequestListPage = lazy(() => import('@/pages/admin/RequestListPage'));
const RequestDetailPage = lazy(() => import('@/pages/admin/RequestDetailPage'));

function PageLoader() {
  return <LoadingSpinner label="Loading page..." />;
}

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/all" element={<AllProductsPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="categories/:slug" element={<CategoryPage />} />
            <Route path="custom-branding" element={<CustomBrandingPage />} />
            <Route path="institutions" element={<InstitutionsPage />} />
            <Route path="trophies-awards" element={<TrophiesAwardsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="request-quote" element={<RequestQuotePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="404" element={<NotFoundPage />} />
          </Route>

          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id/edit" element={<ProductFormPage />} />
              <Route path="categories" element={<CategoryListPage />} />
              <Route path="categories/new" element={<CategoryFormPage />} />
              <Route path="categories/:id/edit" element={<CategoryFormPage />} />
              <Route path="hero-banners" element={<BannerListPage />} />
              <Route path="hero-banners/new" element={<BannerFormPage />} />
              <Route path="hero-banners/:id/edit" element={<BannerFormPage />} />
              <Route path="inquiries" element={<RequestListPage />} />
              <Route path="inquiries/:id" element={<RequestDetailPage />} />
              <Route path="quotes" element={<RequestListPage />} />
              <Route path="quotes/:id" element={<RequestDetailPage />} />
              <Route path="branding" element={<RequestListPage />} />
              <Route path="branding/:id" element={<RequestDetailPage />} />
              <Route path="institutional" element={<RequestListPage />} />
              <Route path="institutional/:id" element={<RequestDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
