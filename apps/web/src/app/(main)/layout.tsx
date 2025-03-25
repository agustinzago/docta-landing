'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import InfoBar from "@/components/infobar/InfoBar"
import MenuOptions from "@/components/MenuOptions/MenuOptions"
import React from "react"
import AuthGuard from '@/components/AuthGuard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname.startsWith('/sign-in') && !pathname.startsWith('/sign-up')) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden h-screen">
      <AuthGuard>
      <MenuOptions />
      <div className="w-full">
        <InfoBar />
        {children}
      </div>
      </AuthGuard>
    </div>
  );
}