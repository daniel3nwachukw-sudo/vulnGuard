import React, { useEffect, useState } from 'react';
import { loadScanHistory } from '../services/scanStore';
import { classifyPort, getRiskColor } from '../services/vulnerabilityDb';

function buildReport(scan) {
  const openPorts = scan.results.filter((item) => item.open);

  const findings = openPorts.map((item) => {
    const vuln = classifyPort(item.port);
    return {
      port: item.port,
      service: vuln.service,
      protocol: vuln.protocol,
      riskLevel: vuln.riskLevel,
      cvss: vuln.cvss,
      description: vuln.description,
      vulnerabilities: vuln.vulnerabilities,
      recommendation: vuln.recommendation,
      riskColor: getRiskColor(vuln.riskLevel),
    };
  });

  const criticalCount = findings.filter((f) => f.riskLevel === 'critical').length;
  const highCount = findings.filter((f) => f.riskLevel === 'high').length;

  return {
    id: scan.id,
    target: scan.target,
    address: scan.address,
    timestamp: scan.timestamp || scan.id,
    openPorts: openPorts.length,
    criticalIssues: criticalCount,
    highIssues: highCount,
    summary: openPorts.length > 0
      ? `Found ${openPorts.length} open port(s): ${criticalCount} critical, ${highCount} high risk. Immediate action required.`
      : `No open ports discovered on ${scan.target}. The target appears closed for the requested ports.`,
    findings,
  };
}

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const history = loadScanHistory();
    setReports(history.map(buildReport));
  }, []);

  const visibleReports = visibleCount > 0 ? reports.slice(0, visibleCount) : reports;

  return (
    <div className="page-card">
      <h1>Reports</h1>
      <p>View generated scan reports and remediation guidance.</p>
      {reports.length > 0 && (
        <div className="report-controls">
          <label>
            Show
            <select
              value={visibleCount}
              onChange={(event) => setVisibleCount(Number(event.target.value))}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={0}>All</option>
            </select>
            latest reports
          </label>
        </div>
      )}
      {reports.length === 0 ? (
        <div className="page-grid">
          <div className="scan-card report-card">
            <h3>No reports yet</h3>
            <p>Run a scan to generate your first report.</p>
          </div>
        </div>
      ) : (
        <div className="page-grid">
          {visibleReports.map((report) => (
            <div key={report.id} className="scan-card report-card">
              <h3>{report.target}</h3>
              <p className="report-summary">{report.summary}</p>
              <p>
                <strong>Open Ports:</strong> {report.openPorts} (
                <span style={{ color: '#dc2626' }}>
                  {report.criticalIssues} critical
                </span>
                , 
                <span style={{ color: '#f97316' }}>
                  {' '}
                  {report.highIssues} high
                </span>
                )
              </p>
              <p>
                <strong>Address:</strong> {report.address}
              </p>
              <div className="report-findings">
                <h4>Findings</h4>
                <ul>
                  {report.findings.map((finding) => (
                    <li key={finding.port} className="finding-item">
                      <div className="finding-header">
                        <span
                          className="risk-badge"
                          style={{ backgroundColor: finding.riskColor }}
                        >
                          {finding.riskLevel.toUpperCase()}
                        </span>
                        <strong>{finding.port}</strong>
                        <span className="service-name">{finding.service}</span>
                        <span className="cvss-score">CVSS {finding.cvss}</span>
                      </div>
                      <p className="finding-desc">{finding.description}</p>
                      <div className="vulnerabilities">
                        <strong>Vulnerabilities:</strong>
                        <ul>
                          {finding.vulnerabilities.map((vuln, idx) => (
                            <li key={idx}>{vuln}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="recommendation">
                        <strong>Recommendation:</strong> {finding.recommendation}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
