import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden w-full">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto relative w-full">
        <div className="flex-1 pb-20 md:pb-0">{children}</div>
      </main>

      <BottomNav />
    </div>);

}