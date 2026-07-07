import Image from 'next/image';

const features = [
  {
    title: 'Asset Discovery',
    description: 'Scan networks, hosts, and services to build a complete asset inventory.',
  },
  {
    title: 'Vulnerability Analysis',
    description: 'Detect missing patches, insecure services, and exposure risks in real time.',
  },
  {
    title: 'Automated Reporting',
    description: 'Generate actionable security reports for compliance and remediation.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-emerald-500/20 px-4 py-1 text-sm font-semibold text-emerald-200">
              VulnGuard - Network Vulnerability Scanner
            </p>
            <h1 className="mb-6 text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
              Secure your network with proactive scanning and intelligent remediation.
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-300">
              VulnGuard helps security teams discover vulnerable assets, analyze risk exposure, and close gaps before attackers exploit them.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400">
                Start Scan
              </button>
              <button className="rounded-full border border-slate-700 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-slate-500">
                View Demo
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-black/20">
            <div className="mb-8 rounded-3xl bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Live scan overview</p>
              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-white">128</p>
                  <p className="text-sm text-slate-400">Assets scanned</p>
                </div>
                <div className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-emerald-300">
                  4 critical
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                  <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
                  <p className="mt-2 text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
