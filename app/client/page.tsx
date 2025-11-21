'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Utensils, TrendingUp, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function ClientDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'client')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user.full_name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Active Diet Plans',
              value: 0,
              icon: Utensils,
              color: 'from-orange-500 to-orange-600',
            },
            {
              title: 'Weight Entries',
              value: 0,
              icon: TrendingUp,
              color: 'from-green-500 to-green-600',
            },
            {
              title: 'My Trainer',
              value: 'Not Assigned',
              icon: User,
              color: 'from-blue-500 to-blue-600',
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
                      <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
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
            <h3 className="text-xl font-bold text-white mb-4">Welcome to Your Dashboard</h3>
            <p className="text-slate-400 mb-4">
              Track your fitness journey with our comprehensive dashboard. View your diet plans, log your weight progress, and stay connected with your trainer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Diet Plans</h4>
                <p className="text-slate-400 text-sm">
                  Access your personalized diet plans created by your trainer
                </p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Weight Tracking</h4>
                <p className="text-slate-400 text-sm">
                  Log your weight regularly and track your progress over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
