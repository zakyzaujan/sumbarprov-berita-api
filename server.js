const express = require("express");
const cors = require("cors");
const { fetchBerita, fetchDetailBerita } = require("./scraper");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("GET API Berita di /api/berita?page=1");
});

/**
 * Daftar Berita:
 *   - GET /api/berita?page=N
 */
app.get("/api/berita", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await fetchBerita(page);
    res.json({ page, count: data.length, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gagal mengambil data berita." });
  }
});

/**
 * Detail Berita:
 *   - GET /api/berita/:id
 */
app.get("/api/berita/:id", async (req, res) => {
  try {
    const detail = await fetchDetailBerita(req.params.id);
    res.json(detail);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gagal mengambil detail berita." });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
