import { NextRequest, NextResponse } from 'next/server';
import { resolveTarget, scanPorts } from '../../../lib/scanner';

const DEFAULT_PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5900, 8080];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { target, ports, timeout, concurrency } = body as {
    target?: string;
    ports?: number[];
    timeout?: number;
    concurrency?: number;
  };

  if (!target) return NextResponse.json({ error: 'target is required' }, { status: 400 });

  let resolved;
  try {
    resolved = await resolveTarget(target);
  } catch (err: any) {
    return NextResponse.json({ error: `Could not resolve target: ${err?.message ?? err}` }, { status: 400 });
  }

  const portList = Array.isArray(ports) && ports.length > 0 ? ports : DEFAULT_PORTS;
  const to = typeof timeout === 'number' ? timeout : 2000;
  const conc = typeof concurrency === 'number' ? Math.max(1, concurrency) : 100;

  const start = Date.now();
  const results = await scanPorts(resolved.address, portList, to, conc);
  const durationMs = Date.now() - start;

  return NextResponse.json({ target, address: resolved.address, durationMs, results });
}
