import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handlePublicApi } from "./server/http";
export default defineConfig({
  ssr: { noExternal: ["gsap", "@gsap/react"] },
  plugins: [
    react(),
    {
      name: "portfolio-content-api",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const path = request.url?.split("?")[0];
          const routes: Record<
            string,
            "content" | "rss" | "sitemap" | "health"
          > = {
            "/api/content": "content",
            "/api/health": "health",
            "/api/rss": "rss",
            "/api/sitemap": "sitemap",
            "/rss.xml": "rss",
            "/sitemap.xml": "sitemap",
          };
          if (path && routes[path])
            void handlePublicApi(request, response, routes[path]).catch(() => {
              response.statusCode = 500;
              response.end("Unable to load content");
            });
          else next();
        });
      },
    },
  ],
});
