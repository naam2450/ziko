import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    company TEXT,
    period TEXT,
    description TEXT
  );
  
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    icon TEXT
  );
`);

// Seed data if empty or missing specific entries
const experienceCount = db.prepare("SELECT COUNT(*) as count FROM experiences").get() as { count: number };
const hasIndofood = db.prepare("SELECT COUNT(*) as count FROM experiences WHERE company LIKE '%Indofood%'").get() as { count: number };

const insertExp = db.prepare("INSERT INTO experiences (title, company, period, description) VALUES (?, ?, ?, ?)");

if (experienceCount.count === 0) {
  insertExp.run("Quality Control Intern", "PT Indofood CBP Sukses Makmur Tbk", "Jun 2023 - Aug 2023", "Melakukan pengawasan mutu bahan baku dan produk jadi sesuai standar HACCP. Berkontribusi dalam analisis laboratorium rutin dan memastikan kepatuhan terhadap regulasi keamanan pangan.");
  insertExp.run("Research & Development Intern", "PT. Industri Pangan Terkemuka", "Jan 2024 - Apr 2024", "Bertanggung jawab dalam formulasi produk minuman fungsional baru...");
  insertExp.run("Penelitian Skripsi: Inovasi Pangan Lokal", "Laboratorium Teknologi Pengolahan Pangan, UB", "2023 - 2024", "Mengembangkan produk pangan berbasis komoditas lokal...");
} else if (hasIndofood.count === 0) {
  insertExp.run("Quality Control Intern", "PT Indofood CBP Sukses Makmur Tbk", "Jun 2023 - Aug 2023", "Melakukan pengawasan mutu bahan baku dan produk jadi sesuai standar HACCP. Berkontribusi dalam analisis laboratorium rutin dan memastikan kepatuhan terhadap regulasi keamanan pangan.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Route
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    if (password === adminPass) {
      res.json({ success: true, token: "mock-jwt-token" });
    } else {
      res.status(401).json({ success: false, message: "Password salah" });
    }
  });

  // API Routes
  app.get("/api/experiences", (req, res) => {
    const experiences = db.prepare("SELECT * FROM experiences").all();
    res.json(experiences);
  });

  app.post("/api/experiences", (req, res) => {
    const { title, company, period, description } = req.body;
    const info = db.prepare("INSERT INTO experiences (title, company, period, description) VALUES (?, ?, ?, ?)").run(title, company, period, description);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/experiences/:id", (req, res) => {
    db.prepare("DELETE FROM experiences WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
