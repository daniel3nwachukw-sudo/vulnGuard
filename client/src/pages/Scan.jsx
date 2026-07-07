import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addScanResult, loadScanHistory } from '../services/scanStore';

const apiBase = import.meta.env.VITE_API_URL || '/api';

export default function Scan() {
  const [target, setTarget] = useState('example.com');
  const [ports, setPorts] = useState('80,443,8080');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadScanHistory());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    // Client-side validation
    const trimmedTarget = target.trim();
    const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    const localhostPattern = /^(localhost|127\.0\.0\.1|::1)$/i;
    const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

    const isValidTarget =
      ipv4Pattern.test(trimmedTarget) ||
      localhostPattern.test(trimmedTarget) ||
      domainPattern.test(trimmedTarget);

    if (!isValidTarget) {
      setError(
        `Invalid target: "${trimmedTarget}". Use a valid IP (e.g., 192.168.1.1), localhost, or domain (e.g., example.com).`
      );
      setLoading(false);
      return;
    }

    try {
      const portList = ports
        .split(',')
        .map((port) => parseInt(port.trim(), 10))
        .filter((port) => !Number.isNaN(port));

      const response = await axios.post(`${apiBase}/scan`, {
        target,
        ports: portList,
      });

      const liveResult = response.data;
      setResult(liveResult);
      setHistory(addScanResult(liveResult));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card">
      <h1>Network Scan</h1>
      <p>Enter a host or IP address to scan open ports and discover services.</p>
      <form onSubmit={handleSubmit} className="scan-form">
        <label>
          Target
          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="example.com"
          />
        </label>

        <label>
          Ports
          <input
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
            placeholder="80,443,8080"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Scanning…' : 'Start Scan'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className="scan-result">
          <h2>Results for {result.target}</h2>
          <p>Resolved IP: {result.address}</p>
          <p>Duration: {result.durationMs} ms</p>
          <table>
            <thead>
              <tr>
                <th>Port</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((item) => (
                <tr key={item.port}>
                  <td>{item.port}</td>
                  <td>{item.open ? 'Open' : 'Closed'}</td>
                  <td>{item.durationMs} ms</td>
                  <td>{item.error || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="scan-history">
        <h2>Recent Scans</h2>
        {history.length === 0 ? (
          <p>No previous scans yet.</p>
        ) : (
          <ul>
            {history.slice(0, 5).map((entry) => (
              <li key={entry.id}>
                <strong>{entry.target}</strong> ({entry.address}) — {entry.results.filter((r) => r.open).length} open port(s)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
