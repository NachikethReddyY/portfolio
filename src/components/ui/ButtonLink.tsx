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
    'border-2 border-ink bg-primary text-on-accent hover:-translate-y-0.5 hover:bg-primary-strong',
  secondary:
    'border-2 border-ink bg-transparent text-ink hover:-translate-y-0.5 hover:bg-primary hover-text-on-accent',
  ghost: 'border-transparent text-muted hover:text-ink hover:bg-surface',
};

const iconVariants = {
  primary: 'bg-terminal text-on-ink',
  secondary: 'bg-terminal text-on-ink group-hover:bg-violet group-hover-text-on-accent',
  ghost: 'bg-surface-strong text-muted group-hover:text-accent',
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
    'pressable group inline-flex min-h-11 items-center justify-center gap-3 rounded-md border py-2 pl-5 pr-2 text-sm font-bold',
    variants[variant],
    className,
  ].join(' ');
  const iconClasses = [
    'grid size-8 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105',
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
