import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-key';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'trainer' | 'client';
  full_name: string;
  phone: string | null;
  status: 'active' | 'inactive';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  console.log(">>>> loginUser called with", email, password);
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .maybeSingle();
       console.log(">>>> Supabase error:", error);
    console.log(">>>> Supabase user:", user);

    if (error || !user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    const userWithoutPassword: User = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone: user.phone,
      status: user.status,
    };

    const token = generateToken(userWithoutPassword);

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    return { success: false, error: 'An error occurred during login' };
  }
}

export function getUserFromToken(token: string): User | null {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  return {
    id: decoded.userId,
    email: decoded.email,
    role: decoded.role,
    full_name: '',
    phone: null,
    status: 'active',
  };
}
