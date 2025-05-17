
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

---

## Base URL

```
http://localhost:5000
```

---

### 1. Daftar Berita

```
GET /api/berita
```

#### Query Parameters

* `page` (integer, optional)
  Halaman yang ingin diambil. Default = `1`.

#### Contoh Request

```
GET http://localhost:5000/api/berita?page=2
```

#### Contoh Response

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
      "published": "11 Januari 2025 11:11:11"
    },
    …
  ]
}
```

---

### 2. Detail Berita

```
GET /api/berita/:id
```

* `:id`
  Identifier berita—bisa berupa slug lengkap (`23456-lorem-ipsum-…`) atau hanya angka (`23456`).

#### Contoh Request

```
GET http://localhost:5000/api/berita/23456
```

#### Contoh Response

```json
{
  "id": "23456",
  "title": "23456 - What is Lorem Ipsum? …",
  "img": "https://sumbarprov.go.id/images/ …",
  "kategori": "Berita Utama",
  "author": "Lorem Ipsum",
  "waktu": "11 Januari 2025 11:11:11 WIB",
  "content": [
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry …",
    "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s …",
    "when an unknown printer took a galley of type and scrambled it to make a type specimen book …",
    "…",
    "and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum …"
  ],
  "views": 11
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

