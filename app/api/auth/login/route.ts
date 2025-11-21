import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (!result.success || !result.user || !result.token) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create response with user + token (for client)
    const response = NextResponse.json(
      {
        success: true,
        user: result.user,
        token: result.token,
      },
      { status: 200 }
    );

    // 🔐 Also set secure HTTP-only cookie for server-side auth
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
