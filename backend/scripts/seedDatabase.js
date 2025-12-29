import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDB } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spotsJsonPath = path.join(__dirname, '..', '..', 'frontend', 'data', 'spots.json');

const readSpotsJson = () => {
  const raw = fs.readFileSync(spotsJsonPath, 'utf-8');
  return JSON.parse(raw).spots || [];
};

const ensureLookup = (table, name) => {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;

  const select = db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(trimmed);
  if (select) return select.id;

  const insert = db.prepare(`INSERT INTO ${table} (name) VALUES (?)`).run(trimmed);
  return insert.lastInsertRowid;
};

const seedSpot = (spot, index) => {
  const spotId = index + 1; // Use 1-based index as spotId

  // Check if spot already exists
  const existingSpot = db.prepare('SELECT spotId FROM spots WHERE spotId = ?').get(spotId);

  let spotDbId;

  if (existingSpot) {
    // Update existing spot (preserves reviews)
    const updateSpot = db.prepare(`
      UPDATE spots SET
        name = ?, area = ?, category = ?, detailLocation = ?, descriptionLong = ?,
        rating = ?, price = ?, priceText = ?, ageRange = ?, openingHours = ?,
        status = ?, imgMainUrl = ?, img2Url = ?, img3Url = ?, mapSrc = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE spotId = ?
    `);

    updateSpot.run(
      spot.name,
      spot.area,
      spot.category || '',
      spot.detailLocation,
      spot.descriptionLong,
      spot.rating,
      spot.price,
      spot.priceText,
      spot.ageRange,
      spot.openingHours,
      spot.status,
      spot.imgMainUrl,
      spot.img2Url,
      spot.img3Url,
      spot.mapSrc,
      spotId
    );

    spotDbId = spotId;

    // Clear existing relationships
    db.prepare('DELETE FROM spot_categories WHERE spotId = ?').run(spotDbId);
    db.prepare('DELETE FROM spot_activities WHERE spotId = ?').run(spotDbId);
  } else {
    // Insert new spot
    const insertSpot = db.prepare(`
      INSERT INTO spots (
        spotId, name, area, category, detailLocation, descriptionLong, rating,
        price, priceText, ageRange, openingHours, status,
        imgMainUrl, img2Url, img3Url, mapSrc
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertSpot.run(
      spotId,
      spot.name,
      spot.area,
      spot.category || '',
      spot.detailLocation,
      spot.descriptionLong,
      spot.rating,
      spot.price,
      spot.priceText,
      spot.ageRange,
      spot.openingHours,
      spot.status,
      spot.imgMainUrl,
      spot.img2Url,
      spot.img3Url,
      spot.mapSrc
    );

    spotDbId = spotId;
  }

  const categories = (spot.category || '').split(',').map(v => v.trim()).filter(Boolean);
  categories.forEach(catName => {
    const catId = ensureLookup('categories', catName);
    if (!catId) return;
    db.prepare('INSERT OR IGNORE INTO spot_categories (spotId, categoryId) VALUES (?, ?)').run(spotDbId, catId);
  });

  (spot.activities || []).filter(Boolean).forEach(activityName => {
    const actId = ensureLookup('activities', activityName);
    if (!actId) return;
    db.prepare('INSERT OR IGNORE INTO spot_activities (spotId, activityId) VALUES (?, ?)').run(spotDbId, actId);
  });
};

const run = () => {
  initDB();

  // Don't delete spots to preserve reviews
  // Only clear relationship tables
  db.exec('DELETE FROM spot_categories; DELETE FROM spot_activities;');

  const spots = readSpotsJson();
  spots.forEach((spot, index) => seedSpot(spot, index));

  console.log(`Seeded ${spots.length} spots (preserved existing reviews).`);
};

run();
