import React from 'react';

export default function ScanCard({ title, value }) {
  return (
    <div className="scan-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
