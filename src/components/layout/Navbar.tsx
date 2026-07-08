import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import type { SiteSettings } from '../../lib/types';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

type NavbarProps = {
  settings: SiteSettings;
};

export function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-3 py-3 sm:px-5">
      <a
        href="#main-content"
        className="text-on-ink sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-terminal focus:px-4 focus:py-3 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary navigation"
        className="cyber-shell mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-3 py-2 backdrop-blur sm:px-4"
      >
        <Link
          to="/"
          className="pressable group flex min-h-11 min-w-0 items-center gap-3 rounded-md pr-3"
          onClick={() => setIsOpen(false)}
        >
          <span
            aria-hidden="true"
            className="site-logo-shell grid size-12 shrink-0 place-items-center rounded-full"
          >
            <img src="/assets/nachiketh-dark-profile-v3.png" alt="" className="site-logo-img" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-base">
              {settings.name}
            </span>
            <span className="block max-w-[13rem] truncate text-xs text-muted sm:max-w-none">
              {settings.role}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                [
                  'pressable min-h-11 rounded-md border-2 px-4 py-2 text-sm font-bold',
                  isActive
                    ? 'border-[rgba(0,210,255,0.72)] bg-transparent text-[#00d2ff]'
                    : 'border-transparent text-muted hover:border-[rgba(0,210,255,0.45)] hover:bg-terminal hover:text-ink',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          className="pressable grid size-11 place-items-center rounded-md border border-[rgba(0,210,255,0.5)] bg-terminal text-ink md:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </nav>

      {isOpen ? (
        <div className="cyber-shell mx-auto mt-2 max-w-7xl overflow-hidden rounded-none p-2 md:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  [
                    'pressable min-h-12 rounded-md border-2 px-4 py-3 text-base font-bold',
                    isActive
                      ? 'border-[rgba(0,210,255,0.72)] bg-[#00d2ff] text-[#0b0b12]'
                      : 'border-transparent text-muted hover:border-[rgba(0,210,255,0.45)] hover:bg-terminal hover:text-ink',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
