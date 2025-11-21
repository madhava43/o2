'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminTrainersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div>Loading...</div>;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Trainers Management</h1>
        <p className="text-slate-400 text-sm">
          Here we will show all trainers and their assigned clients.
        </p>
      </div>
    </DashboardLayout>
  );
}
