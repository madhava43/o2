'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  UserCog,
  Utensils,
  Calendar,
  TrendingUp,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'admin' | 'trainer' | 'client';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Clients', icon: UserCog, path: '/admin/clients' },
    { label: 'Trainers', icon: UserCog, path: '/admin/trainers' },
    { label: 'Diet Plans', icon: Utensils, path: '/admin/diet-plans' },
    { label: 'Events', icon: Calendar, path: '/admin/events' },
    { label: 'Enquiries', icon: TrendingUp, path: '/admin/enquiries' },
  ];

  const trainerNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/trainer' },
    { label: 'My Clients', icon: Users, path: '/trainer/clients' },
    { label: 'Diet Plans', icon: Utensils, path: '/trainer/diet-plans' },
  ];

  const clientNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/client' },
    { label: 'My Diet Plans', icon: Utensils, path: '/client/diet-plans' },
    { label: 'Weight Logs', icon: TrendingUp, path: '/client/weight-logs' },
  ];

  const navItems =
    role === 'admin' ? adminNavItems : role === 'trainer' ? trainerNavItems : clientNavItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex">
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40"
        >
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Premium Gym</span>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => router.push(item.path)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="p-4 bg-slate-800 rounded-lg mb-4">
                <p className="text-sm text-slate-400">Logged in as</p>
                <p className="text-white font-semibold truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={logout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </motion.aside>

        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-300 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="text-slate-300 hover:text-white"
                >
                  View Homepage
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
