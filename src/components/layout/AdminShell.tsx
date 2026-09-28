"use client";

import Sidebar from "./Sidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#E8F3EF]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="min-w-0 flex-1 overflow-hidden">
        {/* Scrollable Page Content */}
        <main className="h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}