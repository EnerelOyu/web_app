import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database файлын зам
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'ayalgo.db');

// Database холболт үүсгэх
const db = new Database(DB_PATH, { verbose: console.log });

// WAL mode - илүү хурдан, concurrent access
db.pragma('journal_mode = WAL');

// Database schema үүсгэх
console.log('🗄️  Database schema үүсгэж байна...');

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

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spotId INTEGER NOT NULL,
    userName TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating REAL NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spotId) REFERENCES spots(id) ON DELETE CASCADE
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    notes TEXT DEFAULT '',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS plan_spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    planId INTEGER NOT NULL,
    spotId INTEGER NOT NULL,
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (planId) REFERENCES plans(id) ON DELETE CASCADE,
    FOREIGN KEY (spotId) REFERENCES spots(id) ON DELETE CASCADE,
    UNIQUE(planId, spotId)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS guides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guideId TEXT UNIQUE NOT NULL,
    lastName TEXT NOT NULL,
    firstName TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    area TEXT,
    category TEXT,
    languages TEXT,
    experienceLevel TEXT,
    profileImgUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_spots_area ON spots(area);
  CREATE INDEX IF NOT EXISTS idx_spots_category ON spots(category);
  CREATE INDEX IF NOT EXISTS idx_reviews_spotId ON reviews(spotId);
  CREATE INDEX IF NOT EXISTS idx_plans_userId ON plans(userId);
`);

console.log('✅ Database schema бэлэн боллоо!');

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

// Seed data for guides
const guidesData = [
  {
    guideId: "g1",
    lastName: "Бат",
    firstName: "Энх",
    phone: "99112233",
    email: "enkh.bat@example.com",
    area: "Төв",
    category: "Байгаль",
    languages: "Монгол,Англи",
    experienceLevel: "1 - 5 жил",
    profileImgUrl: "../files/guide-img/guide1.svg"
  },
  {
    guideId: "g2",
    lastName: "Дорж",
    firstName: "Саруул",
    phone: "88112233",
    email: "sar.dorj@example.com",
    area: "Төв",
    category: "Соёл",
    languages: "Монгол",
    experienceLevel: "1 жил ба түүнээс доош",
    profileImgUrl: "../files/guide-img/guide2.svg"
  },
  {
    guideId: "g3",
    lastName: "Сүрэн",
    firstName: "Одмаа",
    phone: "99117788",
    email: "odmaa.suren@example.com",
    area: "Хангай",
    category: "Байгаль",
    languages: "Монгол,Орос",
    experienceLevel: "5 -аас дээш жил",
    profileImgUrl: "../files/guide-img/guide3.svg"
  },
  {
    guideId: "g4",
    lastName: "Наран",
    firstName: "Хульжиг",
    phone: "88114455",
    email: "khuljig.naran@example.com",
    area: "Говь",
    category: "Адал явдалт",
    languages: "Монгол,Англи",
    experienceLevel: "1 - 5 жил",
    profileImgUrl: "../files/guide-img/guide4.svg"
  }
];

// Insert seed data
const insertSpot = db.prepare(`
  INSERT INTO spots (name, area, category, activities, rating, price, priceText, ageRange, detailLocation, openingHours, status, imgMainUrl, img2Url, img3Url, descriptionLong)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertGuide = db.prepare(`
  INSERT INTO guides (guideId, lastName, firstName, phone, email, area, category, languages, experienceLevel, profileImgUrl)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

console.log('🌱 Seeding database with guides data...');

guidesData.forEach(guide => {
  insertGuide.run(
    guide.guideId,
    guide.lastName,
    guide.firstName,
    guide.phone,
    guide.email,
    guide.area,
    guide.category,
    guide.languages,
    guide.experienceLevel,
    guide.profileImgUrl
  );
});

console.log('✅ Database seeded successfully!');

db.close();

taskkill /PID <PID> /F