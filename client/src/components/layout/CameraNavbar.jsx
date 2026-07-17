import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Camera, Film, Building2, Trophy, User, Mail, Search, Menu, X } from 'lucide-react';
import { useSiteConfig } from '@/context/SiteSettingsContext';
import MobileMenu from './MobileMenu';

const ICON_NAV = [
  { label: 'PRODUCTS', to: '/products', Icon: Camera },
  { label: 'BRANDING', to: '/custom-branding', Icon: Film },
  { label: 'INSTITUTIONS', to: '/institutions', Icon: Building2 },
  { label: 'TROPHIES', to: '/trophies-awards', Icon: Trophy },
  { label: 'ABOUT', to: '/about', Icon: User },
  { label: 'CONTACT', to: '/contact', Icon: Mail },
];

function FocusBrackets({ children, active }) {
  if (!active) return children;

  return (
    <span className="relative inline-flex flex-col items-center px-4 py-1">
      <span className="pointer-events-none absolute inset-0">
        <span className="absolute left-0 top-0 h-[7px] w-[7px] border-l border-t border-white/55" />
        <span className="absolute right-0 top-0 h-[7px] w-[7px] border-r border-t border-white/55" />
        <span className="absolute bottom-0 left-0 h-[7px] w-[7px] border-b border-l border-white/55" />
        <span className="absolute bottom-0 right-0 h-[7px] w-[7px] border-b border-r border-white/55" />
      </span>
      {children}
    </span>
  );
}

function KnurledDial({ className }) {
  return (
    <div
      className={`pointer-events-none absolute h-[18px] w-[18px] rounded-full border border-white/10 bg-[linear-gradient(135deg,#2a2a2a_0%,#111_45%,#2a2a2a_90%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.6)] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-[3px] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,255,255,0.08)_0deg_8deg,transparent_8deg_16deg)]" />
    </div>
  );
}

function StrapLug({ className }) {
  return (
    <div
      className={`pointer-events-none absolute h-[10px] w-[14px] rounded-sm border border-white/10 bg-[#1a1a1a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-x-[4px] top-[3px] h-[3px] rounded-full bg-black/70" />
    </div>
  );
}

function IconNavItem({ label, to, Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex min-w-[58px] flex-col items-center gap-[5px] px-2 transition-colors xl:min-w-[68px] xl:px-3 ${isActive ? 'text-white' : 'text-white/45 hover:text-white/70'}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="h-[15px] w-[15px] stroke-[1.25]" aria-hidden="true" />
          <span className="text-center text-[7px] font-medium leading-tight tracking-[0.16em] xl:text-[8px] xl:tracking-[0.2em]">
            {label}
          </span>
          {isActive && (
            <span className="absolute -bottom-[10px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.85)]" />
          )}
        </>
      )}
    </NavLink>
  );
}

function SocialIcon({ href, label, children }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/40 transition-colors hover:text-white/70"
    >
      {children}
    </a>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] fill-none stroke-current stroke-[1.5]" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}


function VimeoGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] fill-current" aria-hidden="true">
      <path d="M21.8 7.2c-.1 2.1-1.6 5-4.7 8.7-3.1 3.8-5.7 5.7-7.8 5.7-1.3 0-2.4-1.2-3.3-3.6-.6-2.2-1.2-4.4-1.8-6.6-1-3.1-2-4.6-3.1-4.6-.2 0-1 .5-2.4 1.4L2 6.3c2.4-2.1 4.7-4.2 7-6.3 1.9-1.6 3.3-2.5 4.2-2.6 2.2-.2 3.5 1.3 4 4.5.3 1.7.6 3.4 1 5.1.7 3.3 1.4 4.9 2.2 4.9.6 0 1.5-.9 2.7-2.8 1.2-1.9 1.8-3.3 1.9-4.2.2-1.6-.5-2.4-2-2.4-.7 0-1.4.2-2.2.5 1.5-4.9 4.3-7.3 8.5-7.2 3.1.1 4.6 2.1 4.4 6.1z" />
    </svg>
  );
}

export default function CameraNavbar() {
  const { businessName, social } = useSiteConfig();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const logoInitials = businessName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toLowerCase();

  return (
    <>
      <header className="sticky top-0 z-50 bg-black px-3 py-5 sm:px-4 lg:px-6">
        <div className="relative mx-auto w-full max-w-content">
          <StrapLug className="-left-[2px] top-[18px] -rotate-12" />
          <StrapLug className="-right-[2px] top-[18px] rotate-12" />

          <div className="relative overflow-visible">
            {/* Camera body silhouette */}
            <svg
              viewBox="0 0 1080 88"
              className="pointer-events-none absolute inset-x-0 top-0 h-[88px] w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="cameraBody" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#222326" />
                  <stop offset="55%" stopColor="#141519" />
                  <stop offset="100%" stopColor="#0b0c0f" />
                </linearGradient>
                <linearGradient id="cameraHump" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2a2b30" />
                  <stop offset="100%" stopColor="#121318" />
                </linearGradient>
              </defs>
              <path
                d="M 34 34
                   C 34 24, 42 20, 52 20
                   L 430 20
                   C 455 20, 470 8, 490 8
                   L 590 8
                   C 610 8, 625 20, 650 20
                   L 1028 20
                   C 1038 20, 1046 24, 1046 34
                   L 1046 68
                   C 1046 78, 1038 82, 1028 82
                   L 52 82
                   C 42 82, 34 78, 34 68
                   Z"
                fill="url(#cameraBody)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <path
                d="M 468 20
                   C 478 20, 486 12, 498 8
                   L 582 8
                   C 594 12, 602 20, 612 20
                   L 612 24
                   C 602 24, 594 16, 582 12
                   L 498 12
                   C 486 16, 478 24, 468 24
                   Z"
                fill="url(#cameraHump)"
              />
              <rect x="528" y="2" width="24" height="6" rx="1" fill="#6b7078" opacity="0.85" />
            </svg>

            <KnurledDial className="left-[18%] top-[14px] hidden sm:block" />
            <KnurledDial className="right-[18%] top-[14px] hidden sm:block" />

            {/* Desktop camera nav */}
            <div className="relative hidden h-[88px] items-end justify-center gap-4 px-4 pb-[14px] pt-[26px] lg:flex xl:gap-8 2xl:gap-10 lg:px-8">
              <Link
                to="/"
                className="group flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#18191d] shadow-[inset_0_1px_2px_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.45)] transition hover:border-white/20"
                aria-label={`${businessName} home`}
              >
                <span className="font-camera-logo text-[13px] leading-none text-white">
                  {logoInitials}
                  <span className="text-brand-red">.</span>
                </span>
              </Link>

              <NavLink to="/" className="relative mb-[2px]">
                {({ isActive }) => (
                  <FocusBrackets active={isActive}>
                    <span
                      className={`text-[11px] font-medium tracking-[0.28em] ${isActive ? 'text-white' : 'text-white/45'}`}
                    >
                      HOME
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-[11px] left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.85)]" />
                    )}
                  </FocusBrackets>
                )}
              </NavLink>

              <span className="mb-[6px] h-[22px] w-px bg-white/10" aria-hidden="true" />

              <div className="flex items-end gap-3 xl:gap-6 2xl:gap-8">
                {ICON_NAV.map((item, index) => (
                  <div key={item.to} className="flex items-end">
                    {index > 0 && (
                      <span className="mx-2 mb-[6px] h-[22px] w-px bg-white/10 xl:mx-3" aria-hidden="true" />
                    )}
                    <IconNavItem {...item} />
                  </div>
                ))}
              </div>

              <span className="mb-[6px] h-[22px] w-px bg-white/10" aria-hidden="true" />

              <button
                type="button"
                onClick={() => navigate('/search')}
                className="mb-[4px] inline-flex h-8 w-8 items-center justify-center text-white/45 transition-colors hover:text-white/75"
                aria-label="Search products"
              >
                <Search className="h-[15px] w-[15px] stroke-[1.5]" />
              </button>

              <div className="flex items-center gap-4 text-white/40 xl:gap-6">
                <SocialIcon href={social.instagram} label="Instagram">
                  <InstagramGlyph />
                </SocialIcon>
                <SocialIcon href={social.facebook} label="Vimeo">
                  <VimeoGlyph />
                </SocialIcon>
              </div>
            </div>

            {/* Mobile compact bar */}
            <div className="relative flex h-[72px] items-center justify-between px-4 lg:hidden">
              <Link
                to="/"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/10 bg-[#18191d] font-camera-logo text-[13px] text-white"
              >
                {logoInitials}
                <span className="text-brand-red">.</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/search')}
                  className="inline-flex h-10 w-10 items-center justify-center text-white/80"
                  aria-label="Search products"
                >
                  <Search className="h-5 w-5" />
                </button>

                <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center text-white/80"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
