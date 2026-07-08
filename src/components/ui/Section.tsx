import type { ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={['px-4 py-16 sm:px-6 lg:px-8 lg:py-24', className].join(' ')}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}
