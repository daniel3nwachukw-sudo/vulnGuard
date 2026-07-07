import net from 'net';
import dns from 'dns/promises';

export type ScanResult = {
  port: number;
  open: boolean;
  durationMs: number;
  error?: string;
};

export async function resolveTarget(target: string): Promise<{ host: string; address: string }> {
  const ipv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4.test(target)) return { host: target, address: target };
  try {
    const res = await dns.lookup(target);
    return { host: target, address: res.address };
  } catch (err: any) {
    if (err.code === 'ENOTFOUND') {
      throw new Error(`Hostname "${target}" could not be resolved. Please check the hostname or try an IP address.`);
    }
    throw err;
  }
}

export function scanPort(address: string, port: number, timeout = 2000): Promise<ScanResult> {
  // Validate port number
  if (port < 1 || port > 65535) {
    return Promise.resolve({ port, open: false, durationMs: 0, error: 'Port must be between 1 and 65535' });
  }

  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let finished = false;

    socket.setTimeout(timeout);

    socket.once('connect', () => {
      const duration = Date.now() - start;
      finished = true;
      socket.destroy();
      resolve({ port, open: true, durationMs: duration });
    });

    socket.once('timeout', () => {
      if (finished) return;
      finished = true;
      socket.destroy();
      resolve({ port, open: false, durationMs: Date.now() - start });
    });

    socket.once('error', (err: Error) => {
      if (finished) return;
      finished = true;
      socket.destroy();
      resolve({ port, open: false, durationMs: Date.now() - start, error: err.message });
    });

    socket.connect(port, address);
  });
}

export async function scanPorts(address: string, ports: number[], timeout = 2000, concurrency = 100): Promise<ScanResult[]> {
  const results: ScanResult[] = [];
  const chunks: number[][] = [];
  for (let i = 0; i < ports.length; i += concurrency) chunks.push(ports.slice(i, i + concurrency));

  for (const chunk of chunks) {
    const promises = chunk.map((p) => scanPort(address, p, timeout));
    // eslint-disable-next-line no-await-in-loop
    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults);
  }

  // sort by port
  results.sort((a, b) => a.port - b.port);
  return results;
}