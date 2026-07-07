// @ts-ignore: allow side-effect import of CSS in this app layout
import './globals.css';
import type { ReactNode } from 'react';

// Lightweight local Metadata type to avoid depending on 'next' types here
type Metadata = {
  title?: string;
  description?: string;
  [key: string]: any;
};

export const metadata: Metadata = {
  title: 'VulnGuard',
  description: 'Network vulnerability scanner dashboard for proactive security.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
