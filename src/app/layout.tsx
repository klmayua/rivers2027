import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { RegisterSW, SrcFlag, TourBar } from '@/components/shell';

const inter = localFont({
  src: [
    { path: '../fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rivers2027.example'),
  title: { default: 'Chief Barr. Dumo Lulu Briggs · Rivers State', template: '%s · Dumo Lulu Briggs' },
  description: 'Chief Barr. Dumo Lulu Briggs, NDC governorship candidate for Rivers State. Candidate-approved campaign materials are being prepared.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Chief Barr. Dumo Lulu Briggs · Reset Rivers',
    description: 'Rivers State campaign information, sourced geography, and published candidate statements.',
    images: [{ url: '/img/lulu-briggs-1.jpg' }],
    type: 'website',
  },
  icons: { icon: '/favicon.png', apple: '/icons/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // `cover` is what makes env(safe-area-inset-*) resolve, so the bottom bars clear the iPhone home indicator.
  // Zoom is deliberately left unrestricted.
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SrcFlag />
        {children}
        <TourBar />
        <RegisterSW />
      </body>
    </html>
  );
}
