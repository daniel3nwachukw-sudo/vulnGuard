import React, { useEffect, useState } from 'react';
import ScanCard from '../components/ScanCard';
import { loadScanHistory } from '../services/scanStore';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    scans: 0,
    openPorts: 0,
    vulnerabilities: 0,
  });

  useEffect(() => {
    const history = loadScanHistory();
    const openPorts = history.reduce(
      (count, scan) => count + scan.results.filter((item) => item.open).length,
      0
    );

    setMetrics({
      scans: history.length,
      openPorts,
      vulnerabilities: openPorts,
    });
  }, []);

  return (
    <div className="page-card">
      <h1>Dashboard</h1>
      <p>Monitor recent scans, open ports, and vulnerability trends.</p>
      <div className="page-grid">
        <ScanCard title="Recent Scans" value={metrics.scans} />
        <ScanCard title="Vulnerabilities" value={metrics.vulnerabilities} />
        <ScanCard title="Open Ports" value={metrics.openPorts} />
        <ScanCard title="Users" value="1" />
      </div>
    </div>
  );
}
