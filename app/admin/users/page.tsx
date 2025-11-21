'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Role = 'admin' | 'trainer' | 'client';
type Status = 'active' | 'inactive';

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: Role;
  status: Status;
  created_at: string;
};

export default function AdminUsersPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    role: 'client' as Role,
    status: 'active' as Status,
    newPassword: '',
  });

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        void fetchUsers();
      }
    }
  }, [user, isLoading, router]);

  async function fetchUsers() {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoadingUsers(false);
    }
  }

  function openEdit(u: UserRow) {
    setSelectedUser(u);
    setForm({
      full_name: u.full_name || '',
      phone: u.phone || '',
      role: u.role,
      status: u.status,
      newPassword: '',
    });
    setEditOpen(true);
  }

  function openDelete(u: UserRow) {
    setSelectedUser(u);
    setDeleteOpen(true);
  }

  async function handleSave() {
    if (!selectedUser || !token) return;
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedUser.id,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditOpen(false);
        await fetchUsers();
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    }
  }

  async function handleDelete() {
    if (!selectedUser || !token) return;
    try {
      const res = await fetch(`/api/users?id=${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setDeleteOpen(false);
        await fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  }

  if (isLoading || !user) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-slate-400 text-sm">
            Manage admins, trainers and clients. Edit roles, reset passwords, deactivate or remove users.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-4">
            {loadingUsers ? (
              <div className="text-slate-400 py-4">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-800">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Phone</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-800/70">
                        <td className="py-2 pr-4 text-slate-100">
                          {u.full_name || '—'}
                        </td>
                        <td className="py-2 pr-4 text-slate-300">{u.email}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-red-500/10 text-red-400'
                                : u.role === 'trainer'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-slate-500/10 text-slate-400'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-slate-300">
                          {u.phone || '—'}
                        </td>
                        <td className="py-2 pr-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(u)}
                          >
                            Edit
                          </Button>
                          {u.role !== 'admin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                              onClick={() => openDelete(u)}
                            >
                              Delete
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-4 text-center text-slate-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit / reset password dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-slate-300">Full Name</Label>
              <Input
                value={form.full_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full_name: e.target.value }))
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label className="text-slate-300">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, role: v as Role }))
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1">
                <Label className="text-slate-300">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as Status }))
                  }
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">
                Reset Password (optional)
              </Label>
              <Input
                type="password"
                placeholder="Leave empty to keep current password"
                value={form.newPassword}
                onChange={(e) =>
                  setForm((f) => ({ ...f, newPassword: e.target.value }))
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-400">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-200">
              {selectedUser?.full_name || selectedUser?.email}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
