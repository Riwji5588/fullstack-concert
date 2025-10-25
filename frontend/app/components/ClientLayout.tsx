'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';


interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const showSidebar = pathname.startsWith('/admin') || pathname.startsWith('/history') || pathname.startsWith('/user');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className="flex-1 lg:ml-0">
        {/* Mobile Header with Toggle Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {pathname.startsWith('/admin') ? 'Admin Panel' : 'Dashboard'}
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        
        {children}
      </main>
    </div>
  );
}