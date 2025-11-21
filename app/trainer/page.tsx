'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Utensils, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function TrainerDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'trainer')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout role="trainer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Trainer Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'My Clients', value: 0, icon: Users, color: 'from-blue-500 to-blue-600' },
            {
              title: 'Active Diet Plans',
              value: 0,
              icon: Utensils,
              color: 'from-orange-500 to-orange-600',
            },
            {
              title: 'Client Progress',
              value: '0%',
              icon: TrendingUp,
              color: 'from-green-500 to-green-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                    </div>
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
            <p className="text-slate-400">
              Welcome to your trainer dashboard. Here you can manage your assigned clients, create and edit diet plans, and track client progress.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
