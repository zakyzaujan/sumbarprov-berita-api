
---

## Base URL

```
http://localhost:5000
```

---

### 1. Daftar Berita (Paginated)

```
GET /api/berita
```

#### Query Parameters

* `page` (integer, optional)
  Halaman yang ingin diambil. Default = `1`.

* `all` (string, optional)
  Jika diberi nilai `"true"`, maka akan mengembalikan **seluruh** item berita sekaligus (cached). Tanpa `all` atau `all=false`, API akan mengabaikan `page` dan melakukan paginasi normal.

#### Contoh Request

```
GET http://localhost:5000/api/berita?page=2
```

atau

```
GET http://localhost:5000/api/berita?all=true
```

#### Contoh Response (paginated)

```json
{
  "page": 2,
  "count": 5,
  "data": [
    {
      "id": "23592-judul-berita-ke-6",
      "title": "Judul Berita ke-6",
      "summary": "Ringkasan singkat berita ke-6 …",
      "thumbnail": "https://sumbarprov.go.id/images/…",
      "detail_url": "https://sumbarprov.go.id/home/news/23592-…",
      "author": "Nama Penulis",
      "published": "12 Mei 2025 10:15:30"
    },
    …
  ]
}
```

#### Contoh Response (all=true)

```json
{
  "total": 4387,
  "data": [
    /* array semua berita */
  ]
}
```

---

### 2. Detail Berita

```
GET /api/berita/:id
```

* `:id`
  Identifier berita—bisa berupa slug lengkap (`23597-sumbar-siap-…`) atau hanya angka (`23597`).

#### Contoh Request

```
GET http://localhost:5000/api/berita/23597
```

#### Contoh Response

```json
{
  "id": "23597",
  "title": "Sumbar Siap Ukir Sejarah: 808 Pupuik Sarunai …",
  "img": "https://sumbarprov.go.id/images/2025/05/IMG-20250510-WA0015.jpg",
  "kategori": "Berita Utama",
  "author": "Satria Oki Sanjaya, S.I.Kom.(DINAS KOMUNIKASI, …)",
  "waktu": "10 Mei 2025 14:42:04 WIB",
  "content": [
    "Padang - Sumatera Barat (Sumbar) tengah bersiap …",
    "Hal tersebut disampaikan Kepala Dinas Pemuda dan …",
    "“Pupuik sarunai ini alat musik tiup tradisional …”",
    "…",
    "Even Bhinneka Festival Sumbar Tageh 2025 diharapkan …"
  ],
  "views": 86
}
```

---

## Field Descriptions

| Field        | Tipe      | Keterangan                                  |
| ------------ | --------- | ------------------------------------------- |
| `id`         | string    | ID atau slug berita                         |
| `title`      | string    | Judul lengkap berita                        |
| `summary`    | string    | Ringkasan singkat (hanya untuk daftar)      |
| `thumbnail`  | string    | URL gambar thumbnail (hanya untuk daftar)   |
| `detail_url` | string    | Link ke halaman berita asli                 |
| `author`     | string    | Nama penulis                                |
| `published`  | string    | Tanggal & waktu publikasi                   |
| `img`        | string    | URL gambar utama (hanya di endpoint detail) |
| `kategori`   | string    | Nama kategori (misal “Berita Utama”)        |
| `content`    | string\[] | Array paragraf isi berita                   |
| `views`      | number    | Jumlah kunjungan halaman berita             |

---

## Cara Menjalankan

1. Install dependencies:

   ```bash
   npm install
   ```
2. Jalankan server:

   ```bash
   node server.js
   ```
3. Akses API seperti contoh di atas.

---
