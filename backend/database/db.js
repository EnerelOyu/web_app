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
export const initDB = () => {
  console.log('🗄️  Database schema үүсгэж байна...');

  // Spots table
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

  // Reviews table
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

  // Plans table
  db.exec(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      notes TEXT DEFAULT '',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Plan_Spots junction table (many-to-many)
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

  // Guides table
  db.exec(`
    CREATE TABLE IF NOT EXISTS guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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

  // Indexes үүсгэх (хурд нэмэгдүүлэх)
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_spots_area ON spots(area);
    CREATE INDEX IF NOT EXISTS idx_spots_category ON spots(category);
    CREATE INDEX IF NOT EXISTS idx_reviews_spotId ON reviews(spotId);
    CREATE INDEX IF NOT EXISTS idx_plans_userId ON plans(userId);
  `);

  console.log('✅ Database schema бэлэн боллоо!');
};

export default db;