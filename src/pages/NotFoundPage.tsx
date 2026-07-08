import { Seo } from '../components/Seo';
import { ButtonLink } from '../components/ui/ButtonLink';
import { Section } from '../components/ui/Section';

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" description="The page you requested could not be found." />
      <Section className="py-24">
        <div className="brutal-panel mx-auto max-w-2xl p-8 text-center">
          <p className="font-tech text-sm font-bold text-primary-strong">404</p>
          <h1 className="mt-4 font-display text-5xl font-black text-ink">This page is not here.</h1>
          <p className="mt-4 font-semibold text-muted">
            The route might have changed, or the content may not be published yet.
          </p>
          <div className="mt-8">
            <ButtonLink href="/" variant="primary">
              Go Home
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
