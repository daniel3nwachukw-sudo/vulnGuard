import React, { useEffect, useState } from 'react';
import ScanCard from '../components/ScanCard';
import { loadScanHistory } from '../services/scanStore';

export default function Home() {
  const [metrics, setMetrics] = useState({
    activeScans: 0,
    openPorts: 0,
    criticalIssues: 0,
    reports: 0,
  });

  useEffect(() => {
    const history = loadScanHistory();
    const openPorts = history.reduce(
      (count, scan) => count + scan.results.filter((item) => item.open).length,
      0
    );

    setMetrics({
      activeScans: history.length,
      openPorts,
      criticalIssues: openPorts,
      reports: history.length,
    });
  }, []);

  return (
    <div className="page-card">
      <h1>Welcome to VulnGuard</h1>
      <p>
        Vulnerability scanning and dashboard management for network security.
      </p>
      <div className="page-grid">
        <ScanCard title="Active Scans" value={metrics.activeScans} />
        <ScanCard title="Open Ports" value={metrics.openPorts} />
        <ScanCard title="Critical Issues" value={metrics.criticalIssues} />
        <ScanCard title="Reports" value={metrics.reports} />
      </div>
    </div>
  );
}
