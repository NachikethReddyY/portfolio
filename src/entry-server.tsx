import { renderToReadableStream, renderToStaticMarkup } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "./content/store";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects, { ProjectDetail } from "./pages/Projects";
import Writing, { ArticleDetail } from "./pages/Writing";
export async function render(path: string) {
  const element = (
    <StaticRouter location={path}>
      <ContentProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/writing/:slug" element={<ArticleDetail />} />
            <Route path="/blog/:slug" element={<ArticleDetail />} />
          </Routes>
        </Layout>
      </ContentProvider>
    </StaticRouter>
  );
  // Resolve lazy article renderers before producing HTML that also works without JavaScript.
  const stream = await renderToReadableStream(element);
  await stream.allReady;
  await new Response(stream).text();
  return renderToStaticMarkup(element);
}
