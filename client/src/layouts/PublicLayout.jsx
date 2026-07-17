import { Outlet } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <TopBar />
      <Navbar />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton variant="float" />
    </div>
  );
}
