// FILE: src/components/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import { useUI } from '../context/UIContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useUI();

  return (
    <div className="flex min-h-screen">
      {isSidebarOpen && <Sidebar />}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Layout;
