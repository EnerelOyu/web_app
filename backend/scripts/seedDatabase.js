import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database файлын зам
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'ayalgo.db');

// Database холболт үүсгэх
const db = new Database(DB_PATH, { verbose: console.log });

// Seed data for spots
const spotsData = [
  {
    name: "Цонжин Болдог",
    area: "Төв",
    category: "Соёл",
    activities: JSON.stringify(["Морин аялал", "Амьтантай ойр"]),
    rating: 4.5,
    price: 20000,
    priceText: "20,000₮",
    ageRange: "Бүх нас",
    detailLocation: "Төв аймгийн Эрдэнэ сумын нутагт байрладаг.",
    openingHours: "09:00–18:00",
    status: "Нээлттэй",
    imgMainUrl: "https://lp-cms-production.imgix.net/2023-07/shutterstockRF1229637994.jpg",
    img2Url: null,
    img3Url: null,
    descriptionLong: "Цонжин Болдог нь Монголын аялал жуулчлалын чухал цэгүүдийн нэг."
  },
  {
    name: "Амарбаясгалант хийд",
    area: "Сэлэнгэ",
    category: "Түүхэн, Соёл",
    activities: JSON.stringify(["Уран барилга", "Түүхийн аялал"]),
    rating: 4.3,
    price: 500000,
    priceText: "500,000₮",
    ageRange: "18–45",
    detailLocation: "Сэлэнгэ аймгийн Баруунбүрэн сумын нутаг.",
    openingHours: "09:00–18:00",
    status: "Нээлттэй",
    imgMainUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    img2Url: null,
    img3Url: null,
    descriptionLong: "Амарбаясгалант хийд нь Монголын хамгийн том буддын хийдүүдийн нэг."
  },
  {
    name: "Горхи-Тэрэлж",
    area: "Төв",
    category: "Байгаль",
    activities: JSON.stringify(["Гэрэл зураг авах", "Пикник"]),
    rating: 4.4,
    price: 15000,
    priceText: "15,000₮",
    ageRange: "Бүх нас",
    detailLocation: "Төв аймгийн нутагт байрладаг.",
    openingHours: "24/7",
    status: "Нээлттэй",
    imgMainUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    img2Url: null,
    img3Url: null,
    descriptionLong: "Горхи-Тэрэлж нь Улаанбаатар хотын ойролцоох аялал жуулчлалын бүс."
  },
  {
    name: "Шар Нохой хад",
    area: "Төв",
    category: "Байгаль",
    activities: JSON.stringify(["Гэрэл зураг авах", "Хадан аялал"]),
    rating: 4.2,
    price: 5000,
    priceText: "5,000₮",
    ageRange: "Бүх нас",
    detailLocation: "Горхи-Тэрэлжийн бүсэд байрладаг.",
    openingHours: "24/7",
    status: "Нээлттэй",
    imgMainUrl: "https://images.unsplash.com/photo-1542744095-291d1f67b221",
    img2Url: null,
    img3Url: null,
    descriptionLong: "Шар Нохой хад нь өвөрмөц хэлбэр бүхий байгалийн тогтоцтой хад юм."
  },
  {
    name: "Улаанбаатар Хүрээ музей",
    area: "Улаанбаатар",
    category: "Түүхэн",
    activities: JSON.stringify(["Музейн үзмэр", "Түүхийн аялал"]),
    rating: 4.0,
    price: 0,
    priceText: "Үнэгүй",
    ageRange: "Бүх нас",
    detailLocation: "Улаанбаатар хотын төв хэсэгт байрладаг.",
    openingHours: "10:00–18:00",
    status: "Нээлттэй",
    imgMainUrl: "https://images.unsplash.com/photo-1583508915901-b5f84c1dcde1",
    img2Url: null,
    img3Url: null,
    descriptionLong: "Улаанбаатар Хүрээ музей нь нийслэлийн түүхийг харуулсан сонирхолтой музей юм."
  }
];

// Insert seed data
const insertSpot = db.prepare(`
  INSERT INTO spots (name, area, category, activities, rating, price, priceText, ageRange, detailLocation, openingHours, status, imgMainUrl, img2Url, img3Url, descriptionLong)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

console.log('🌱 Seeding database with spots data...');

spotsData.forEach(spot => {
  insertSpot.run(
    spot.name,
    spot.area,
    spot.category,
    spot.activities,
    spot.rating,
    spot.price,
    spot.priceText,
    spot.ageRange,
    spot.detailLocation,
    spot.openingHours,
    spot.status,
    spot.imgMainUrl,
    spot.img2Url,
    spot.img3Url,
    spot.descriptionLong
  );
});

console.log('✅ Database seeded successfully!');

db.close();