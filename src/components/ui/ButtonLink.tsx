import { ArrowUpRight } from 'lucide-react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  external?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const variants = {
  primary:
    'border border-[#00d2ff] bg-[#0d1622] text-ink shadow-[6px_6px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5',
  secondary:
    'border border-[#00d2ff] bg-transparent text-ink shadow-[6px_6px_0_#243a56] hover:-translate-x-0.5 hover:-translate-y-0.5',
  ghost: 'border border-transparent text-muted hover:border-[#00d2ff]/40 hover:bg-terminal hover:text-ink',
};

const iconVariants = {
  primary: 'border border-[#00d2ff]/50 bg-terminal text-on-ink',
  secondary: 'border border-[#00d2ff]/50 bg-terminal text-on-ink',
  ghost: 'bg-surface-strong text-muted group-hover:text-primary',
};

export function ButtonLink({
  href,
  children,
  variant = 'secondary',
  external,
  className = '',
  ...props
}: ButtonLinkProps) {
  const classes = [
    'pressable group inline-flex min-h-11 items-center justify-center gap-3 rounded-none py-2 pl-5 pr-2 font-tech text-sm font-extrabold uppercase',
    variants[variant],
    className,
  ].join(' ');
  const iconClasses = [
    'grid size-8 shrink-0 place-items-center rounded-none transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
    iconVariants[variant],
  ].join(' ');
  const icon = (
    <span className={iconClasses}>
      <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2} />
    </span>
  );

  if (external || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith('http') ? '_blank' : props.target}
        rel={href.startsWith('http') ? 'noreferrer' : props.rel}
        {...props}
      >
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link to={href} className={classes}>
      {children}
      {icon}
    </Link>
  );
}
