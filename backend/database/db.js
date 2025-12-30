import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(__filename);

// Database файлын зам
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'ayalgo.db');

// Database холболт үүсгэх
const db = new Database(DB_PATH, { verbose: console.log });

// WAL mode - илүү хурдан, concurrent access
db.pragma('journal_mode = WAL');

// Database schema үүсгэх
export const initDB = () => {
  console.log('Database schema үүсгэж байна...');

  // Spots table
  db.exec(`
    CREATE TABLE IF NOT EXISTS spots (
      spotId INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      area TEXT NOT NULL,
      category TEXT DEFAULT '',
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
      mapSrc TEXT,
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
      FOREIGN KEY (spotId) REFERENCES spots(spotId) ON DELETE CASCADE
    )
  `);

  // Guide Reviews table
  db.exec(`
    CREATE TABLE IF NOT EXISTS guide_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guideId TEXT NOT NULL,
      userName TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guideId) REFERENCES guides(guideId) ON DELETE CASCADE
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
      FOREIGN KEY (spotId) REFERENCES spots(spotId) ON DELETE CASCADE,
      UNIQUE(planId, spotId)
    )
  `);

  // Guides table
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

  // Indexes үүсгэх (хурд нэмэгдүүлэх)
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_spots_area ON spots(area);
    CREATE INDEX IF NOT EXISTS idx_spots_category ON spots(category);
    CREATE INDEX IF NOT EXISTS idx_reviews_spotId ON reviews(spotId);
    CREATE INDEX IF NOT EXISTS idx_guide_reviews_guideId ON guide_reviews(guideId);
    CREATE INDEX IF NOT EXISTS idx_plans_userId ON plans(userId);
  `);
  // Categories lookup
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );
`);

// Activities lookup
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );
`);

// Spot ↔ category link
db.exec(`
  CREATE TABLE IF NOT EXISTS spot_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spotId INTEGER NOT NULL,
    categoryId INTEGER NOT NULL,
    FOREIGN KEY (spotId) REFERENCES spots(spotId) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(spotId, categoryId)
  );
`);

// Spot ↔ activity link
db.exec(`
  CREATE TABLE IF NOT EXISTS spot_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spotId INTEGER NOT NULL,
    activityId INTEGER NOT NULL,
    FOREIGN KEY (spotId) REFERENCES spots(spotId) ON DELETE CASCADE,
    FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE,
    UNIQUE(spotId, activityId)
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_spot_categories_spotId ON spot_categories(spotId);
  CREATE INDEX IF NOT EXISTS idx_spot_activities_spotId ON spot_activities(spotId);
`);


  console.log('Database schema бэлэн боллоо!');
};

// Guides functions
export const insertGuide = (guideData) => {
  // Generate guideId
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM guides');
  const { count } = countStmt.get();
  const guideId = `g${count + 1}`;

  const stmt = db.prepare(`
    INSERT INTO guides (guideId, lastName, firstName, phone, email, area, category, languages, experienceLevel, profileImgUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    guideId,
    guideData.lastName,
    guideData.firstName,
    guideData.phone,
    guideData.email,
    guideData.area,
    guideData.category,
    guideData.languages,
    guideData.experienceLevel,
    guideData.profileImgUrl
  );
  return { id: result.lastInsertRowid, guideId };
};

export const getAllGuides = () => {
  const stmt = db.prepare('SELECT * FROM guides ORDER BY createdAt DESC');
  return stmt.all();
};

// Plan functions
export const createPlan = (userId) => {
  const stmt = db.prepare(`
    INSERT INTO plans (userId)
    VALUES (?)
  `);
  const result = stmt.run(userId);
  return { planId: result.lastInsertRowid };
};

export const getPlanByUserId = (userId) => {
  const stmt = db.prepare('SELECT * FROM plans WHERE userId = ? ORDER BY createdAt DESC LIMIT 1');
  return stmt.get(userId);
};

export const addSpotToPlan = (planId, spotId) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO plan_spots (planId, spotId)
      VALUES (?, ?)
    `);
    const result = stmt.run(planId, spotId);
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    // UNIQUE constraint failure - spot already in plan
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message.includes('UNIQUE')) {
      return { success: false, error: 'exists' };
    }
    throw error;
  }
};

export const removeSpotFromPlan = (planId, spotId) => {
  const stmt = db.prepare(`
    DELETE FROM plan_spots
    WHERE planId = ? AND spotId = ?
  `);
  const result = stmt.run(planId, spotId);
  return result.changes > 0;
};

export const getPlanSpots = (planId) => {
  const stmt = db.prepare(`
    SELECT s.*, ps.addedAt
    FROM spots s
    JOIN plan_spots ps ON s.spotId = ps.spotId
    WHERE ps.planId = ?
    ORDER BY ps.addedAt ASC
  `);
  return stmt.all(planId);
};

export const updatePlanNotes = (planId, notes) => {
  const stmt = db.prepare(`
    UPDATE plans
    SET notes = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const result = stmt.run(notes, planId);
  return result.changes > 0;
};

export const clearPlan = (planId) => {
  const stmt = db.prepare(`
    DELETE FROM plan_spots
    WHERE planId = ?
  `);
  const result = stmt.run(planId);
  return result.changes;
};

// Review functions
export const getReviewsBySpotId = (spotId) => {
  const stmt = db.prepare(`
    SELECT * FROM reviews
    WHERE spotId = ?
    ORDER BY createdAt DESC
  `);
  return stmt.all(spotId);
};

export const createReview = (spotId, userName, comment, rating) => {
  const stmt = db.prepare(`
    INSERT INTO reviews (spotId, userName, comment, rating)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(spotId, userName, comment, rating);
  return { id: result.lastInsertRowid };
};

// Guide Review functions
export const getReviewsByGuideId = (guideId) => {
  const stmt = db.prepare(`
    SELECT * FROM guide_reviews
    WHERE guideId = ?
    ORDER BY createdAt DESC
  `);
  return stmt.all(guideId);
};

export const createGuideReview = (guideId, userName, comment, rating) => {
  const stmt = db.prepare(`
    INSERT INTO guide_reviews (guideId, userName, comment, rating)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(guideId, userName, comment, rating);
  return { id: result.lastInsertRowid };
};

export default db;