import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AMG FOUNDATION Community Library',
  description: 'Smart Library & Learning Hub for AMG FOUNDATION Community Library.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
