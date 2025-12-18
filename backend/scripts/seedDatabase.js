import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDB } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spotsJsonPath = path.join(__dirname, '..', '..', 'frontend', 'json', 'spots.json');

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

const seedSpot = (spot) => {
  const insertSpot = db.prepare(`
    INSERT INTO spots (
      name, area, category, detailLocation, descriptionLong, rating,
      price, priceText, ageRange, openingHours, status,
      imgMainUrl, img2Url, img3Url, mapSrc
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const spotResult = insertSpot.run(
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

  const spotDbId = spotResult.lastInsertRowid;

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

<<<<<<< HEAD
db.close();

taskkill /PID <PID> /F
=======
const run = () => {
  initDB();
  db.exec('DELETE FROM spot_categories; DELETE FROM spot_activities; DELETE FROM spots; VACUUM;');

  const spots = readSpotsJson();
  spots.forEach(spot => seedSpot(spot));

  console.log(`Seeded ${spots.length} spots.`);
};

run();
>>>>>>> ce25b65cdd8230bfd5fe9b4dd22a29c4a2a41c11
