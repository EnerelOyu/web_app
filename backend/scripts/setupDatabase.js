import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'ayalgo.db');

console.log('Creating database at:', DB_PATH);
const db = new Database(DB_PATH);

console.log('Initializing schema...');
db.exec(`
  CREATE TABLE IF NOT EXISTS spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    category TEXT NOT NULL,
    activities TEXT,
    rating REAL DEFAULT 0,
    price INTEGER DEFAULT 0,
    priceText TEXT,
    ageRange TEXT DEFAULT 'Бүх нас',
    detailLocation TEXT,
    openingHours TEXT,
    status TEXT DEFAULT 'Нээлттэй',
    imgMainUrl TEXT,
    img2Url TEXT,
    img3Url TEXT,
    descriptionLong TEXT,
    reviewCount INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Seeding data...');
const insertSpot = db.prepare(`
  INSERT INTO spots (name, area, category, activities, rating, price, priceText, ageRange, detailLocation, openingHours, status, imgMainUrl, img2Url, img3Url, descriptionLong)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const spots = [
  ['Цонжин Болдог', 'Төв', 'Соёл', '["Морин аялал", "Амьтантай ойр"]', 4.5, 20000, '20,000₮', 'Бүх нас', 'Төв аймгийн Эрдэнэ сумын нутагт байрладаг.', '09:00–18:00', 'Нээлттэй', 'https://lp-cms-production.imgix.net/2023-07/shutterstockRF1229637994.jpg', null, null, 'Цонжин Болдог нь Монголын аялал жуулчлалын чухал цэгүүдийн нэг.'],
  ['Амарбаясгалант хийд', 'Сэлэнгэ', 'Түүхэн, Соёл', '["Уран барилга", "Түүхийн аялал"]', 4.3, 500000, '500,000₮', '18–45', 'Сэлэнгэ аймгийн Баруунбүрэн сумын нутаг.', '09:00–18:00', 'Нээлттэй', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', null, null, 'Амарбаясгалант хийд нь Монголын хамгийн том буддын хийдүүдийн нэг.']
];

spots.forEach(spot => insertSpot.run(...spot));

console.log('Database setup complete!');
db.close();