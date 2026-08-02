import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import type { SiteSettings } from '../../lib/types';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Work' },
  { href: '/blog', label: 'Writing' },
  { href: '/#about', label: 'About', anchor: true },
  { href: '/contact', label: 'Contact' },
];

type NavbarProps = {
  settings: SiteSettings;
};

export function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 px-3 py-3 sm:px-5"
      onKeyDown={(event) => event.key === 'Escape' && setIsOpen(false)}
    >
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
            <span className="block truncate font-display text-base font-bold">
              {settings.name}
            </span>
            <span className="block max-w-[13rem] truncate text-xs text-muted sm:max-w-none">
              {settings.role}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) =>
            item.anchor ? (
              <a
                key={item.href}
                href={item.href}
                className="pressable inline-flex min-h-11 items-center rounded-md border-2 border-transparent px-4 py-2 text-sm font-bold text-muted hover:border-[rgba(0,210,255,0.45)] hover:bg-terminal hover:text-ink"
              >
                {item.label}
              </a>
            ) : (
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
            ),
          )}
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="pressable grid size-11 place-items-center rounded-md border border-[rgba(0,210,255,0.5)] bg-terminal text-ink md:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
      </nav>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="cyber-shell absolute left-1/2 top-[calc(100%-0.25rem)] w-[calc(100%-1.5rem)] max-w-7xl -translate-x-1/2 overflow-hidden p-2 shadow-[0_6px_0_rgba(36,58,86,0.75)] md:hidden"
        >
          <div className="grid grid-cols-2 gap-1">
            {navItems.map((item) =>
              item.anchor ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="pressable flex min-h-11 items-center border border-transparent px-3 py-2 text-sm font-bold text-muted hover:border-[rgba(0,210,255,0.35)] hover:bg-terminal hover:text-ink"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    [
                      'pressable flex min-h-11 items-center border px-3 py-2 text-sm font-bold',
                      isActive
                        ? 'border-[rgba(0,210,255,0.55)] bg-[rgba(0,210,255,0.1)] text-[#7ddcff]'
                        : 'border-transparent text-muted hover:border-[rgba(0,210,255,0.35)] hover:bg-terminal hover:text-ink',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
