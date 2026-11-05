import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  Home,
  FileText,
  Heart,
  MapPin,
  LayoutGrid,
  MessageSquare,
  Camera,
  Users,
  Calendar,
  Mic,
  Phone,
  BookOpen,
  HelpCircle,
  Newspaper,
  Share2,
  Shield,
  Check,
  Plus,
  BarChart2,
  Wallet,
  Scale,
  Flag,
  Clock,
  Link2,
  QrCode,
  ChevronLeft,
  Map,
  Bell,
  Search,
  Scroll,
  Send,
  Download,
  Lock,
  Globe,
  Building2,
  Zap,
  ChevronDown,
  ArrowRight,
  Quote,
  Eye,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

/** Static images served as-is: no image optimiser needed, so the demo behaves the same on Vercel and offline. */
export function Pic({ src, alt, w, h, className, style, priority }: { src: string; alt: string; w: number; h: number; className?: string; style?: CSSProperties; priority?: boolean }) {
  return <Image src={src} alt={alt} width={w} height={h} className={className} style={style} priority={priority} unoptimized />;
}

export function Emblem({ size = 40 }: { size?: number }) {
  return <span aria-label="NDC" className="ndc-badge" style={{ width: size, height: size }}>NDC</span>;
}

export function Portrait({ size = 38, ring = true, variant = 1 }: { size?: number; ring?: boolean; variant?: 1 | 2 }) {
  return (
    <Pic
      src={variant === 1 ? '/img/lulu-briggs-1.jpg' : '/img/lulu-briggs-2.jpg'}
      alt="Chief Barr. Dumo Lulu Briggs"
      w={size * 2}
      h={size * 2}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 14%', border: ring ? '2px solid var(--green)' : undefined }}
    />
  );
}

export function Stripe() {
  return <div className="stripe" />;
}

const LUCIDE_MAP: Record<string, LucideIcon> = {
  home: Home,
  report: FileText,
  heart: Heart,
  pin: MapPin,
  grid: LayoutGrid,
  chat: MessageSquare,
  camera: Camera,
  users: Users,
  calendar: Calendar,
  mic: Mic,
  phone: Phone,
  book: BookOpen,
  help: HelpCircle,
  news: Newspaper,
  share: Share2,
  shield: Shield,
  check: Check,
  plus: Plus,
  chart: BarChart2,
  wallet: Wallet,
  scale: Scale,
  flag: Flag,
  clock: Clock,
  link: Link2,
  qr: QrCode,
  back: ChevronLeft,
  map: Map,
  bell: Bell,
  search: Search,
  scroll: Scroll,
  send: Send,
  download: Download,
  lock: Lock,
  globe: Globe,
  building: Building2,
  zap: Zap,
  down: ChevronDown,
  arrow: ArrowRight,
  quote: Quote,
  eye: Eye,
  out: LogOut,
};

const PATHS: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  report: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z',
  pin: 'M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  chat: 'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l2-5.2A8.4 8.4 0 1 1 21 11.5z',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  calendar: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18',
  mic: 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5V22h16',
  help: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4.9 4.9l4.3 4.3M14.8 14.8l4.3 4.3M14.8 9.2l4.3-4.3M4.9 19.1l4.3-4.3',
  news: 'M4 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2zM19 8h2v10a2 2 0 0 1-2 2M8 8h7M8 12h7M8 16h4',
  share: 'M18 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  check: 'M20 6L9 17l-5-5',
  plus: 'M12 5v14M5 12h14',
  chart: 'M12 20V10M18 20V4M6 20v-4',
  wallet: 'M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z',
  scale: 'M12 3v18M5 21h14M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z',
  flag: 'M5 22V4M5 4h13l-2 4 2 4H5',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  qr: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v.01M14 20h3M20 17v4',
  back: 'M15 18l-6-6 6-6',
  map: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4zM8 2v16M16 6v16',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  search: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.3-4.3',
  scroll: 'M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4M19 17V5a2 2 0 0 0-2-2H4',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  building: 'M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M15 9h4a1 1 0 0 1 1 1v11M2 21h20M8 7h3M8 11h3M8 15h3',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9z',
  down: 'M6 9l6 6 6-6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  quote: 'M3 21c3 0 7-1 7-8V5H3v8h4c0 3-2 4-4 4zM14 21c3 0 7-1 7-8V5h-7v8h4c0 3-2 4-4 4z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
};

export function Icon({ name, size = 20, className }: { name: keyof typeof PATHS | string; size?: number; className?: string }) {
  const Comp = LUCIDE_MAP[name];
  if (Comp) {
    return <Comp size={size} className={className} strokeWidth={1.8} aria-hidden="true" />;
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] ?? PATHS.grid} />
    </svg>
  );
}
