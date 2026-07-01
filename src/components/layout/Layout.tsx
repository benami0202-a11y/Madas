import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { FAB } from '@/components/layout/FAB';

export function Layout() {
  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-[#0b0d12]">
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-8 lg:px-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <FAB />
    </div>
  );
}
