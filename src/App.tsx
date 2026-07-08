import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PageLayout } from './components/layout/PageLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AboutPage } from './pages/AboutPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsIndexPage } from './pages/ProjectsIndexPage';

const StudioPage = lazy(() =>
  import('./pages/StudioPage').then((module) => ({ default: module.StudioPage })),
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="studio/*"
          element={
            <Suspense fallback={null}>
              <StudioPage />
            </Suspense>
          }
        />
        <Route element={<PageLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogIndexPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="projects" element={<ProjectsIndexPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
