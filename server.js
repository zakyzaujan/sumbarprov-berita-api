const express = require("express");
const cors = require("cors");
const {
  fetchBerita,
  getAllBeritaCached,
  fetchDetailBerita,
} = require("./scraper");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.get("/", (req, res) => {
  res.send("Cek API Berita di /api/berita.");
});

/**
 * Daftar Berita:
 *  - /api/berita?page=N
 *  - /api/berita?all=true
 */
app.get("/api/berita", async (req, res) => {
  try {
    if (req.query.all === "true") {
      const data = await getAllBeritaCached();
      return res.json({ total: data.length, data });
    }
    const page = parseInt(req.query.page) || 1;
    const data = await fetchBerita(page);
    res.json({ page, count: data.length, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gagal mengambil data berita." });
  }
});

/**
 * Detail Berita:
 *  - /api/berita/:id
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
