import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, addUser } from '../../../../lib/users';
import { signToken, buildSetCookie } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const id = (globalThis as any).crypto?.randomUUID?.() ?? String(Date.now());

  const user = await addUser({ id, email, passwordHash });

  const token = signToken({ sub: user.id, email: user.email });
  const cookie = buildSetCookie(token);

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201, headers: { 'Set-Cookie': cookie } });
}
