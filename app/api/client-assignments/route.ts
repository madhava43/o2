// app/api/client-assignments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromToken } from '@/lib/auth';

// --- Admin guard (same as /api/users) ---
async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing token', status: 401 as const };
  }

  const token = authHeader.split(' ')[1];
  const user = getUserFromToken(token);

  if (!user || user.role !== 'admin') {
    return { error: 'Not authorized', status: 403 as const };
  }

  return { admin: user };
}

// ================= GET /api/client-assignments =================
// Returns: clients (from users + clients) and trainer list (from users)
export async function GET(req: NextRequest) {
  const check = await requireAdmin(req);
  if ('error' in check) {
    return NextResponse.json(
      { success: false, error: check.error },
      { status: check.status }
    );
  }

  // All trainers (from users)
  const { data: trainers, error: trainersError } = await supabase
    .from('users')
    .select('id, full_name, email, status')
    .eq('role', 'trainer')
    .order('full_name', { ascending: true });

  if (trainersError) {
    console.error('GET /api/client-assignments trainersError', trainersError);
    return NextResponse.json(
      { success: false, error: 'Failed to load trainers' },
      { status: 500 }
    );
  }

  // All clients (from users)
  const { data: clientUsers, error: clientUsersError } = await supabase
    .from('users')
    .select('id, full_name, email, phone, status, created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  if (clientUsersError) {
    console.error('GET /api/client-assignments clientUsersError', clientUsersError);
    return NextResponse.json(
      { success: false, error: 'Failed to load clients' },
      { status: 500 }
    );
  }

  // Extended client info (assignment, height, weights, etc.)
  const { data: clientDetails, error: clientDetailsError } = await supabase
    .from('clients')
    .select(
      'id, user_id, assigned_trainer_id, height, current_weight, target_weight'
    );

  if (clientDetailsError) {
    console.error('GET /api/client-assignments clientDetailsError', clientDetailsError);
    return NextResponse.json(
      { success: false, error: 'Failed to load client details' },
      { status: 500 }
    );
  }

  // Map user_id -> client detail
  const detailMap = new Map<string, (typeof clientDetails)[number]>();
  (clientDetails || []).forEach((row) => {
    detailMap.set(row.user_id, row);
  });

  const clients = (clientUsers || []).map((u) => {
    const detail = detailMap.get(u.id);
    return {
      user_id: u.id,                 // user primary key
      client_id: detail?.id ?? null, // row in clients table
      full_name: u.full_name,
      email: u.email,
      phone: u.phone,
      status: u.status,
      created_at: u.created_at,
      assigned_trainer_id: detail?.assigned_trainer_id ?? null,
      height: detail?.height ?? null,
      current_weight: detail?.current_weight ?? null,
      target_weight: detail?.target_weight ?? null,
    };
  });

  return NextResponse.json({
    success: true,
    clients,
    trainers,
  });
}

// ================= POST /api/client-assignments =================
// Body: { client_user_id, trainer_user_id }  -> assign/change trainer
export async function POST(req: NextRequest) {
  const check = await requireAdmin(req);
  if ('error' in check) {
    return NextResponse.json(
      { success: false, error: check.error },
      { status: check.status }
    );
  }

  const body = await req.json();
  const { client_user_id, trainer_user_id } = body;

  if (!client_user_id || !trainer_user_id) {
    return NextResponse.json(
      { success: false, error: 'client_user_id and trainer_user_id are required' },
      { status: 400 }
    );
  }

  // Upsert into clients table (unique user_id)
  const { data, error } = await supabase
    .from('clients')
    .upsert(
      {
        user_id: client_user_id,
        assigned_trainer_id: trainer_user_id,
      },
      { onConflict: 'user_id' }
    )
    .select('id, user_id, assigned_trainer_id')
    .single();

  if (error) {
    console.error('POST /api/client-assignments error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign trainer' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, client: data });
}

// ================= DELETE /api/client-assignments =================
// Query: ?clientUserId=...  -> remove trainer assignment for that client
export async function DELETE(req: NextRequest) {
  const check = await requireAdmin(req);
  if ('error' in check) {
    return NextResponse.json(
      { success: false, error: check.error },
      { status: check.status }
    );
  }

  const { searchParams } = new URL(req.url);
  const clientUserId = searchParams.get('clientUserId');

  if (!clientUserId) {
    return NextResponse.json(
      { success: false, error: 'clientUserId is required' },
      { status: 400 }
    );
  }

  // We only clear the assigned_trainer_id, we do NOT delete the client row
  const { data, error } = await supabase
    .from('clients')
    .update({ assigned_trainer_id: null })
    .eq('user_id', clientUserId)
    .select('id, user_id, assigned_trainer_id');

  if (error) {
    console.error('DELETE /api/client-assignments error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear trainer assignment' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
