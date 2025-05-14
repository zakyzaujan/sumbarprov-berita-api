const axios = require("axios");
const cheerio = require("cheerio");
const pLimit = require("p-limit");
const NodeCache = require("node-cache");

// Cache TTL 1 jam
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const BASE_URL = "https://sumbarprov.go.id/home/index-berita";

/**
 * Scrape satu halaman daftar berita.
 */
async function fetchBerita(page = 1) {
  const url = page === 1 ? BASE_URL : `${BASE_URL}/${(page - 1) * 5}`;
  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Node.js Scraper" },
  });
  const $ = cheerio.load(html);
  const items = [];

  $(".card-body > .row").each((_, row) => {
    const el = $(row);
    const title = el.find("h3.font-weight-normal").text().trim();
    const summary = el.find("p.text-muted").text().trim();
    const thumbnail = el.find("img").attr("src");
    const detailUrl = el.find("a.btn-outline-primary").attr("href");
    const metaText = el.find("p").last().text().trim();
    const [, rest] = metaText.split("oleh :");
    const [authorPart, ...dateParts] = rest.split(",");
    const published = dateParts.join(",").replace("WIB", "").trim();

    items.push({
      id: detailUrl.split("/").pop(),
      title,
      summary,
      thumbnail,
      detail_url: detailUrl,
      author: authorPart.trim(),
      published,
    });
  });

  return items;
}

/**
 * Scrape detail berita berdasarkan ID atau URL.
 */
async function fetchDetailBerita(idOrUrl) {
  const url = idOrUrl.startsWith("http")
    ? idOrUrl
    : `https://sumbarprov.go.id/home/news/${idOrUrl}`;

  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Node.js Scraper" },
  });
  const $ = cheerio.load(html);
  const card = $("main .card").first();

  const kategori = card.find("span.badge.badge-danger").text().trim() || null;
  const author = card.find("span.badge.badge-warning").text().trim() || null;
  const waktu = card.find("span.badge.badge-info").text().trim() || null;

  // Ambil konten : semua <p> di dalam .card-body, kecuali yang mengandung badge
  let content = [];
  card.find(".card-body > p").each((_, el) => {
    const p = $(el);
    if (p.find("span.badge").length) return;
    if (p.hasClass("text-center")) {
      // di dalam text-center bisa ada <p> terpisah
      p.find("p").each((_, pp) => {
        const txt = $(pp).text().trim();
        if (txt) content.push(txt);
      });
    } else {
      const txt = p.text().trim();
      if (txt) content.push(txt);
    }
  });

  // Ambil jumlah views
  const viewsText = card.find(".card-footer").text().trim();
  const viewsMatch = viewsText.match(/\d+/);
  const views = viewsMatch ? parseInt(viewsMatch[0], 10) : null;

  return {
    id: idOrUrl,
    title: card.find(".card-header h3").text().trim(),
    img: card.find(".card-body img").attr("src"),
    kategori,
    author,
    waktu,
    content,
    views,
  };
}

/**
 * Baca total halaman secara dinamis.
 */
async function getTotalPages() {
  const { data: html } = await axios.get(BASE_URL, {
    headers: { "User-Agent": "Node.js Scraper" },
  });
  const $ = cheerio.load(html);
  const pages = $("ul.pagination a[data-ci-pagination-page]")
    .map((_, a) => parseInt($(a).data("ci-pagination-page")))
    .get()
    .filter((n) => !isNaN(n));
  return pages.length ? Math.max(...pages) : 1;
}

/**
 * Ambil semua berita dengan concurrency terbatas & cache.
 */
async function getAllBeritaCached(maxConcurrency = 3) {
  const key = "allBerita";
  if (cache.has(key)) return cache.get(key);
  const totalPages = await getTotalPages();
  const limit = pLimit(maxConcurrency);
  const tasks = [];
  for (let i = 1; i <= totalPages; i++) {
    tasks.push(limit(() => fetchBerita(i).catch(() => [])));
  }
  const data = (await Promise.all(tasks)).flat();
  cache.set(key, data);
  return data;
}

module.exports = { fetchBerita, getAllBeritaCached, fetchDetailBerita };
