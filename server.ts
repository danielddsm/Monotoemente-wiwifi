import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock data from user request
  const gestoresData = [
    { id: 1, nome: "ESCOLA CDE01", gestor: "FRANCINETE SERRAO DO NASCIMENTO", tel: "92994458698", base: 90 },
    { id: 2, nome: "ESCOLA CDE02", gestor: "MARIA FRANCISCA DE ALMEIDA SILVA", tel: "92994378040", base: 85 },
    { id: 3, nome: "ESCOLA CDE03", gestor: "ADRIANA DE LIMA BRASIL", tel: "92994363985", base: 70 },
    { id: 4, nome: "ESCOLA CDE04", gestor: "ANSELMO DE OLIVEIRA PALHETA NETO", tel: "92994331857", base: 75 },
    { id: 5, nome: "ESCOLA CDE05", gestor: "DALTON RONNER BATISTA DOS SANTOS", tel: "92994514127", base: 80 },
    { id: 6, nome: "ESCOLA CDE06", gestor: "HAYDEÉ DOS SANTOS CARNEIRO", tel: "92994576703", base: 95 },
    { id: 7, nome: "ESCOLA CDE07", gestor: "JEANE MELGUEIROS HIDALGO", tel: "92994518779", base: 88 }
  ];

  // API Route
  app.get("/api/dados", (req, res) => {
    const dashboard = gestoresData.map(u => ({
      ...u,
      total: u.base + Math.floor(Math.random() * 20) - 10, // Simulação de clientes
      status: Math.random() > 0.05 ? "ONLINE" : "OFFLINE",
      trafego: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    }));
    res.json(dashboard);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
