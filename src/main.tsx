import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContentProvider } from "./content/store";
import PageTransition from "./components/PageTransition";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects, { ProjectDetail } from "./pages/Projects";
import Writing, { ArticleDetail } from "./pages/Writing";
import NotFound from "./pages/NotFound";
import { PageRecovery, RenderBoundary } from "./components/RenderBoundary";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/geist-mono/wght.css";
import "@fontsource/geist-pixel/latin-400.css";
import "./site.css";
const StudioPage = lazy(() => import("./cms/StudioPage"));
function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <Routes>
          <Route
            path="/studio/*"
            element={
              <Suspense
                fallback={
                  <div className="studio-loading">Opening content studio…</div>
                }
              >
                <StudioPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <PageTransition>
                  {(location) => (
                    <Routes location={location}>
                      <Route path="/" element={<Home />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route
                        path="/projects/:slug"
                        element={<ProjectDetail />}
                      />
                      <Route path="/writing" element={<Writing />} />
                      <Route
                        path="/writing/:slug"
                        element={<ArticleDetail />}
                      />
                      <Route
                        path="/about"
                        element={<Navigate to="/#about" replace />}
                      />
                      <Route
                        path="/contact"
                        element={<Navigate to="/#contact" replace />}
                      />
                      <Route
                        path="/blog"
                        element={<Navigate to="/writing" replace />}
                      />
                      <Route path="/blog/:slug" element={<ArticleDetail />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  )}
                </PageTransition>
              </Layout>
            }
          />
        </Routes>
      </ContentProvider>
    </BrowserRouter>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RenderBoundary fallback={<PageRecovery />}>
      <App />
    </RenderBoundary>
  </StrictMode>,
);
