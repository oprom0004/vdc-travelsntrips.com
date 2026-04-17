import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const logPath = path.join(process.cwd(), "server_start.log");
fs.writeFileSync(logPath, "Server starting at " + new Date().toISOString() + "\n");

const CACHE_FILE = path.join(process.cwd(), "content_cache.json");
console.log("Loading cache from:", CACHE_FILE);
fs.appendFileSync(logPath, "Loading cache from: " + CACHE_FILE + "\n");

// Load or initialize cache
let contentCache: Record<string, any> = {};
if (fs.existsSync(CACHE_FILE)) {
  contentCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API for client-side to fetch pre-generated content
  app.get("/api/content/:key", (req, res) => {
    const { key } = req.params;
    res.json(contentCache[key] || { error: "Not found" });
  });

  // API for client-side to save generated content to cache
  app.post("/api/content/save", express.json({ limit: "2mb" }), (req, res) => {
    const { key, data } = req.body;
    if (key && data) {
      contentCache[key] = data;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(contentCache, null, 2));
      console.log(`Saved content to cache: ${key}`);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);

        // Determine SEO content based on URL from CACHE ONLY
        let seoData = null;
        if (url === "/" || url === "/index.html") {
          seoData = contentCache["home"];
        } else {
          // Handle flat slugs: /variable-dc-power-supply-800v
          const corePrefix = "variable-dc-power-supply-";
          const segments = url.split("/").filter(Boolean);
          const fullSlug = segments[0] || "";
          
          if (fullSlug.startsWith(corePrefix)) {
            const baseSlug = fullSlug.replace(corePrefix, "");
            seoData = contentCache[`keyword_${baseSlug}`];
          } else if (contentCache[`keyword_${fullSlug}`]) {
            // Fallback for slugs without prefix if they exist
            seoData = contentCache[`keyword_${fullSlug}`];
          }
        }

        // Inject into HTML for SEO
        if (seoData) {
          const seoHtml = `
            <title>${seoData.title}</title>
            <script>window.__PRELOADED_STATE__ = ${JSON.stringify(seoData)};</script>
            <div id="seo-content" style="display:none">
              <h1>${seoData.title}</h1>
              ${seoData.sections?.map((s: any) => `<h2>${s.heading}</h2><p>${s.content}</p>`).join("") || ""}
            </div>
          `;
          template = template.replace("</head>", `${seoHtml}</head>`);
        }

        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        res.status(500).end((e as Error).message);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
