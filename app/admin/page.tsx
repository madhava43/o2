'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, UserCog, Utensils, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminDashboard() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTrainers: 0,
    activeDietPlans: 0,
    newEnquiries: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'client',
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && token) {
      fetchStats();
    }
  }, [user, token]);

  const fetchStats = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [usersRes] = await Promise.all([
        fetch('/api/users', { headers }),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const clients = usersData.users?.filter((u: any) => u.role === 'client').length || 0;
        const trainers = usersData.users?.filter((u: any) => u.role === 'trainer').length || 0;

        setStats({
          totalClients: clients,
          totalTrainers: trainers,
          activeDietPlans: 0,
          newEnquiries: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setOpenDialog(false);
        setNewUser({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'client',
        });
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Welcome back, {user.full_name}</p>
          </div>

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Plus className="mr-2 h-5 w-5" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New User</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Add a new client or trainer to the system
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300">
                    Role
                  </Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {isCreating ? 'Creating...' : 'Create User'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Clients',
              value: stats.totalClients,
              icon: Users,
              color: 'from-blue-500 to-blue-600',
            },
            {
              title: 'Total Trainers',
              value: stats.totalTrainers,
              icon: UserCog,
              color: 'from-green-500 to-green-600',
            },
            {
              title: 'Active Diet Plans',
              value: stats.activeDietPlans,
              icon: Utensils,
              color: 'from-orange-500 to-orange-600',
            },
            {
              title: 'New Enquiries',
              value: stats.newEnquiries,
              icon: TrendingUp,
              color: 'from-purple-500 to-purple-600',
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
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-slate-400">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={() => router.push('/admin/users')}
              >
                <Users className="mr-2 h-5 w-5" />
                Manage All Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={() => router.push('/admin/clients')}
              >
                <UserCog className="mr-2 h-5 w-5" />
                View All Clients
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-700"
                onClick={() => router.push('/admin/diet-plans')}
              >
                <Utensils className="mr-2 h-5 w-5" />
                View All Diet Plans
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-slate-400">
                Latest system updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-slate-300 text-sm">System is running smoothly</p>
                    <p className="text-slate-500 text-xs">All services operational</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
