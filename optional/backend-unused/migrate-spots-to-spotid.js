import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'ayalgo.db');
const SPOTS_JSON_PATH = path.join(__dirname, '..', 'frontend', 'json', 'spots.json');

console.log('Starting migration: id -> spotId');

// Read spots.json to get the mapping
const spotsJson = JSON.parse(fs.readFileSync(SPOTS_JSON_PATH, 'utf8'));
const spotIdMap = {};
spotsJson.spots.forEach(spot => {
  spotIdMap[spot.name] = spot.spotId;
});

const db = new Database(DB_PATH);
db.pragma('foreign_keys = OFF');

// Begin transaction
const migration = db.transaction(() => {
  console.log('Step 1: Creating new spots table with spotId as primary key...');

  // Create new table with spotId
  db.exec(`
    CREATE TABLE spots_new (
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

  console.log('Step 2: Copying data from old table to new table...');

  // Get all spots from old table
  const oldSpots = db.prepare('SELECT * FROM spots').all();

  // Insert into new table with correct spotId
  const insertStmt = db.prepare(`
    INSERT INTO spots_new (
      spotId, name, area, category, activities, rating, price, priceText,
      ageRange, detailLocation, openingHours, status, imgMainUrl, img2Url,
      img3Url, mapSrc, descriptionLong, reviewCount, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  oldSpots.forEach(spot => {
    const spotId = spotIdMap[spot.name];
    if (!spotId) {
      console.warn(`Warning: No spotId mapping found for "${spot.name}"`);
      return;
    }

    insertStmt.run(
      spotId, spot.name, spot.area, spot.category, spot.activities,
      spot.rating, spot.price, spot.priceText, spot.ageRange,
      spot.detailLocation, spot.openingHours, spot.status,
      spot.imgMainUrl, spot.img2Url, spot.img3Url, spot.mapSrc,
      spot.descriptionLong, spot.reviewCount, spot.createdAt, spot.updatedAt
    );
  });

  console.log('Step 3: Updating foreign key references...');

  // Update spot_categories table
  db.exec(`
    CREATE TABLE spot_categories_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spotId INTEGER NOT NULL,
      categoryId INTEGER NOT NULL,
      FOREIGN KEY (spotId) REFERENCES spots_new(spotId) ON DELETE CASCADE,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE(spotId, categoryId)
    )
  `);

  // Copy spot_categories data with new spotId
  const oldSpotCategories = db.prepare('SELECT * FROM spot_categories').all();
  const insertSpotCategoryStmt = db.prepare(`
    INSERT INTO spot_categories_new (spotId, categoryId)
    VALUES (?, ?)
  `);

  oldSpotCategories.forEach(sc => {
    const oldSpot = oldSpots.find(s => s.id === sc.spotId);
    if (oldSpot) {
      const newSpotId = spotIdMap[oldSpot.name];
      if (newSpotId) {
        insertSpotCategoryStmt.run(newSpotId, sc.categoryId);
      }
    }
  });

  // Update spot_activities table
  db.exec(`
    CREATE TABLE spot_activities_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spotId INTEGER NOT NULL,
      activityId INTEGER NOT NULL,
      FOREIGN KEY (spotId) REFERENCES spots_new(spotId) ON DELETE CASCADE,
      FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE,
      UNIQUE(spotId, activityId)
    )
  `);

  // Copy spot_activities data with new spotId
  const oldSpotActivities = db.prepare('SELECT * FROM spot_activities').all();
  const insertSpotActivityStmt = db.prepare(`
    INSERT INTO spot_activities_new (spotId, activityId)
    VALUES (?, ?)
  `);

  oldSpotActivities.forEach(sa => {
    const oldSpot = oldSpots.find(s => s.id === sa.spotId);
    if (oldSpot) {
      const newSpotId = spotIdMap[oldSpot.name];
      if (newSpotId) {
        insertSpotActivityStmt.run(newSpotId, sa.activityId);
      }
    }
  });

  // Update plan_spots table
  db.exec(`
    CREATE TABLE plan_spots_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planId INTEGER NOT NULL,
      spotId INTEGER NOT NULL,
      addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (planId) REFERENCES plans(id) ON DELETE CASCADE,
      FOREIGN KEY (spotId) REFERENCES spots_new(spotId) ON DELETE CASCADE,
      UNIQUE(planId, spotId)
    )
  `);

  // Copy plan_spots data with new spotId
  const oldPlanSpots = db.prepare('SELECT * FROM plan_spots').all();
  const insertPlanSpotStmt = db.prepare(`
    INSERT INTO plan_spots_new (planId, spotId, addedAt)
    VALUES (?, ?, ?)
  `);

  oldPlanSpots.forEach(ps => {
    const oldSpot = oldSpots.find(s => s.id === ps.spotId);
    if (oldSpot) {
      const newSpotId = spotIdMap[oldSpot.name];
      if (newSpotId) {
        insertPlanSpotStmt.run(ps.planId, newSpotId, ps.addedAt);
      }
    }
  });

  // Update reviews table
  db.exec(`
    CREATE TABLE reviews_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spotId INTEGER NOT NULL,
      userName TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (spotId) REFERENCES spots_new(spotId) ON DELETE CASCADE
    )
  `);

  // Copy reviews data with new spotId
  const oldReviews = db.prepare('SELECT * FROM reviews').all();
  const insertReviewStmt = db.prepare(`
    INSERT INTO reviews_new (spotId, userName, comment, rating, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  oldReviews.forEach(review => {
    const oldSpot = oldSpots.find(s => s.id === review.spotId);
    if (oldSpot) {
      const newSpotId = spotIdMap[oldSpot.name];
      if (newSpotId) {
        insertReviewStmt.run(newSpotId, review.userName, review.comment, review.rating, review.createdAt);
      }
    }
  });

  console.log('Step 4: Dropping old tables and renaming new tables...');

  // Drop old tables
  db.exec('DROP TABLE reviews');
  db.exec('DROP TABLE plan_spots');
  db.exec('DROP TABLE spot_activities');
  db.exec('DROP TABLE spot_categories');
  db.exec('DROP TABLE spots');

  // Rename new tables
  db.exec('ALTER TABLE spots_new RENAME TO spots');
  db.exec('ALTER TABLE spot_categories_new RENAME TO spot_categories');
  db.exec('ALTER TABLE spot_activities_new RENAME TO spot_activities');
  db.exec('ALTER TABLE plan_spots_new RENAME TO plan_spots');
  db.exec('ALTER TABLE reviews_new RENAME TO reviews');

  console.log('Step 5: Recreating indexes...');

  // Recreate indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_spots_area ON spots(area);
    CREATE INDEX IF NOT EXISTS idx_spots_category ON spots(category);
    CREATE INDEX IF NOT EXISTS idx_reviews_spotId ON reviews(spotId);
    CREATE INDEX IF NOT EXISTS idx_spot_categories_spotId ON spot_categories(spotId);
    CREATE INDEX IF NOT EXISTS idx_spot_activities_spotId ON spot_activities(spotId);
  `);

  console.log('Migration completed successfully!');
});

// Execute migration
try {
  migration();
  db.pragma('foreign_keys = ON');
  db.close();
  console.log('\nDatabase migration complete!');
  console.log('spotId is now the primary key for spots table.');
} catch (error) {
  console.error('Migration failed:', error);
  db.close();
  process.exit(1);
}
