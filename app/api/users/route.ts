// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { getUserFromToken } from '@/lib/auth';

// 🔐 Allow only admins (using our JWT, not Supabase auth)
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

// ========== GET /api/users ==========
export async function GET(req: NextRequest) {
  const check = await requireAdmin(req);
  if ('error' in check) {
    return NextResponse.json(
      { success: false, error: check.error },
      { status: check.status }
    );
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, phone, role, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET /api/users error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load users' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, users: data });
}

// ========== POST /api/users ==========
export async function POST(req: NextRequest) {
  const check = await requireAdmin(req);
  if ('error' in check) {
    return NextResponse.json(
      { success: false, error: check.error },
      { status: check.status }
    );
  }

  const body = await req.json();
  const { email, password, full_name, phone, role } = body;

  if (!email || !password || !role) {
    return NextResponse.json(
      { success: false, error: 'Email, password and role are required' },
      { status: 400 }
    );
  }

  const password_hash = await bcrypt.hash(password, 10);

  // 1) Create user
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({
      email,
      password_hash,
      full_name,
      phone,
      role,
      status: 'active',
    })
    .select('id, email, full_name, phone, role, status, created_at')
    .single();

  if (userError || !user) {
    console.error('POST /api/users error', userError);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }

  // 2) Create extended row based on role
  try {
    if (role === 'client') {
      await supabase
        .from('clients')
        .insert({ user_id: user.id }); // other fields NULL / defaults
    } else if (role === 'trainer') {
      await supabase
        .from('trainers')
        .insert({ user_id: user.id });
    }
  } catch (e) {
    console.error('Failed to create extended profile row', e);
    // we won’t fail the whole request, but you could if you prefer
  }

  return NextResponse.json({ success: true, user });
}


// ========== PUT /api/users ==========
export async function PUT(req: NextRequest) {
  const check = await requireAdmin(req);
  if ('error' in check) {
    return NextResponse.json(
      { success: false, error: check.error },
      { status: check.status }
    );
  }

  const body = await req.json();
  const { id, full_name, phone, role, status, newPassword } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'User id is required' },
      { status: 400 }
    );
  }

  const update: any = {
    full_name,
    phone,
    role,
    status,
  };

  if (newPassword && newPassword.trim().length > 0) {
    update.password_hash = await bcrypt.hash(newPassword, 10);
  }

  console.log('PUT /api/users -> updating', { id, update });

  const { data, error } = await supabase
    .from('users')
    .update(update)
    // 🔴 FIXED: use "id" instead of "uuid"
    .eq('id', id)
    .select('id, email, full_name, phone, role, status, created_at');

  console.log('PUT /api/users supabase result', { data, error });

  if (error) {
    console.error('PUT /api/users error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, user: data[0] });
}

// ========== DELETE /api/users ==========
export async function DELETE(req: NextRequest) {
  const check = await requireAdmin(req);
  if ('error' in check) {
    return NextResponse.json(
      { success: false, error: check.error },
      { status: check.status }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'User id is required' },
      { status: 400 }
    );
  }

  console.log('DELETE /api/users -> deleting', { id });

  const { data, error } = await supabase
    .from('users')
    .delete()
    // 🔴 FIXED: use "id" instead of "uuid"
    .eq('id', id)
    .select('id');

  console.log('DELETE /api/users supabase result', { data, error });

  if (error) {
    console.error('DELETE /api/users error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
