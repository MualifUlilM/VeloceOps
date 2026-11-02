import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VeloceOps — High-Velocity B2B Treasury & Smart Invoicing Operating System',
  description: 'Multi-tenant B2B financial operating system powered by PostgreSQL Row-Level Security, Stripe Webhooks, and AI CFO Copilot.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&f[]=general-sans@500,600,700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F2F2EE] text-[#121316] antialiased selection:bg-[#D4F338] selection:text-[#121316]">
        {children}
      </body>
    </html>
  );
}
