// app/admin/clients/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ClientRow = {
  user_id: string;
  client_id: string | null;
  full_name: string | null;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  assigned_trainer_id: string | null;
  height: number | null;
  current_weight: number | null;
  target_weight: number | null;
};

type TrainerRow = {
  id: string;
  full_name: string | null;
  email: string;
  status: 'active' | 'inactive';
};

export default function AdminClientsPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [trainers, setTrainers] = useState<TrainerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingClientId, setSavingClientId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        void fetchData();
      }
    }
  }, [user, isLoading, router]);

  async function fetchData() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/client-assignments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
        setTrainers(data.trainers);
      } else {
        console.error(data.error);
        alert(data.error || 'Failed to load clients');
      }
    } catch (err) {
      console.error('Failed to load clients', err);
      alert('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignTrainer(clientUserId: string, trainerUserId: string | null) {
    if (!token) return;
    setSavingClientId(clientUserId);

    try {
      if (!trainerUserId || trainerUserId === 'none') {
        // Unassign trainer
        const res = await fetch(
          `/api/client-assignments?clientUserId=${clientUserId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!data.success) {
          console.error(data.error);
          alert(data.error || 'Failed to clear assignment');
          return;
        }
        setClients((prev) =>
          prev.map((c) =>
            c.user_id === clientUserId
              ? { ...c, assigned_trainer_id: null }
              : c
          )
        );
      } else {
        // Assign / change trainer
        const res = await fetch('/api/client-assignments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            client_user_id: clientUserId,
            trainer_user_id: trainerUserId,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          console.error(data.error);
          alert(data.error || 'Failed to assign trainer');
          return;
        }
        setClients((prev) =>
          prev.map((c) =>
            c.user_id === clientUserId
              ? { ...c, assigned_trainer_id: data.client.assigned_trainer_id }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to assign trainer', err);
      alert('Failed to update trainer assignment');
    } finally {
      setSavingClientId(null);
    }
  }

  function getTrainerName(id: string | null) {
    if (!id) return 'Unassigned';
    const t = trainers.find((tr) => tr.id === id);
    return t?.full_name || t?.email || 'Unknown';
  }

  if (isLoading || !user) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients Management</h1>
          <p className="text-slate-400 text-sm">
            View all clients, assign trainers, and quickly access client details.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-4">
            {loading ? (
              <div className="text-slate-400 py-4">Loading clients...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-800">
                      <th className="py-2 pr-4">Client</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Phone</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Assigned Trainer</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr
                        key={c.user_id}
                        className="border-b border-slate-800/70 align-middle"
                      >
                        <td className="py-2 pr-4 text-slate-100">
                          {c.full_name || '—'}
                        </td>
                        <td className="py-2 pr-4 text-slate-300">
                          {c.email}
                        </td>
                        <td className="py-2 pr-4 text-slate-300">
                          {c.phone || '—'}
                        </td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-slate-500/10 text-slate-400'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 min-w-[220px]">
                          <Label className="text-xs text-slate-400 mb-1 block">
                            Assigned Trainer
                          </Label>
                          <Select
                            value={c.assigned_trainer_id || 'none'}
                            onValueChange={(val) =>
                              handleAssignTrainer(
                                c.user_id,
                                val === 'none' ? null : val
                              )
                            }
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs">
                              <SelectValue
                                placeholder="Select trainer"
                                aria-label={getTrainerName(
                                  c.assigned_trainer_id
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-64">
                              <SelectItem value="none">None</SelectItem>
                              {trainers.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.full_name || t.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            disabled={savingClientId === c.user_id}
                            onClick={() => {
                              // later: navigate to detailed client view
                              // router.push(`/admin/clients/${c.user_id}`);
                              alert(
                                'Client detail page with progress & weight logs will be the next feature.'
                              );
                            }}
                          >
                            {savingClientId === c.user_id
                              ? 'Saving...'
                              : 'Details'}
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {clients.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-4 text-center text-slate-500"
                        >
                          No clients found.
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
    </DashboardLayout>
  );
}
