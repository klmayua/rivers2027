import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack never adopts a stray lockfile in a parent folder.
  turbopack: {
    root: process.cwd(),
  },
  poweredByHeader: false,
  // The first build served the public app under /ika. Keep every old link, QR code and SMS working.
  async redirects() {
    return [
      { source: '/ika', destination: '/', permanent: true },
      { source: '/ika/manifesto', destination: '/agenda', permanent: true },
      { source: '/ika/desk', destination: '/help-desk', permanent: true },
      { source: '/ika/report', destination: '/report-card', permanent: true },
      { source: '/ika/join', destination: '/get-involved', permanent: true },
      { source: '/ika/more', destination: '/', permanent: true },
      { source: '/ika/:page(contract|events|news|projects|wards|academy|about)', destination: '/:page', permanent: true },
      { source: '/ika/:rest*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
