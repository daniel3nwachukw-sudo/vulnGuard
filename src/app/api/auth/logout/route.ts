import { NextResponse } from 'next/server';
import { buildClearCookie } from '../../../../lib/auth';

export async function POST() {
  const cookie = buildClearCookie();
  return NextResponse.json({ ok: true }, { status: 200, headers: { 'Set-Cookie': cookie } });
}
