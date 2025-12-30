import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDB } from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spotsJsonPath = path.join(__dirname, '..', '..', 'frontend', 'data', 'spots.json');

const readSpotsJson = () => {
  const raw = fs.readFileSync(spotsJsonPath, 'utf-8');
  return JSON.parse(raw).spots || []; // JSON.parse(raw) = текстийг жинхэнэ JS object болгоно. Дотор нь .spots гэж массив байвал буцаана.
};

const ensureLookup = (table, name) => { //нэр байвал DB-д олж/үүсгэж ID буцаана
  if (!name) return null; //Нэр байхгүй бол шууд null
  const trimmed = name.trim();
  if (!trimmed) return null; //" " шиг зөвхөн хоосон зай байвал null.

  /* ${table} = хүснэгтийн нэрээ орлуулж тавина.
  ? = параметр (SQL injection хамгаалалт)
  .get(trimmed) = нэг мөр (row) олбол авна. */
  const select = db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(trimmed);
  if (select) return select.id;

  /* Байхгүй бол insert хийнэ
  Шинээр мөр нэмнэ.
  .run() → INSERT ажиллуулна.
  lastInsertRowid → шинээр нэмэгдсэн мөрийн ID.*/
  const insert = db.prepare(`INSERT INTO ${table} (name) VALUES (?)`).run(trimmed);
  return insert.lastInsertRowid;
};

const seedSpot = (spot, index) => {
  const spotId = index + 1; // Use 1-based index as spotId
  /* JSON-ийн 0-оос эхэлдэг индексыг 1-ээс эхэлдэг болгож байна.
  Тэгэхээр:
  эхний spot → spotId=1
  хоёр дахь spot → spotId=2
  Анхаарах зүйл: энэ арга нь JSON-ийн дараалал өөрчлөгдвөл spotId солигдоно. */
  
  // Spot байгаа эсэхийг шалгах
  const existingSpot = db.prepare('SELECT spotId FROM spots WHERE spotId = ?').get(spotId);

  let spotDbId;
  // Доор нь ашиглах spot-ийн ID-г хадгалах хувьсагч.

  if (existingSpot) {
    // Хэрвээ spot өмнө нь байсан бол UPDATE хийнэ (review-ийг хадгална)
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

    // Category/Activity нь олон-олонтой холбоотой (many-to-many) байдаг.
    // Шинэчилсэн spot-д хуучин холбоо үлдэхгүй байлгахын тулд эхлээд устгаад, дараа нь шинээр insert хийнэ.
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

  // Category-уудыг задлаад spot_categories холбоос хүснэгтэд хийнэ
  const categories = (spot.category || '').split(',').map(v => v.trim()).filter(Boolean);
  categories.forEach(catName => {
    const catId = ensureLookup('categories', catName);
    if (!catId) return;
    db.prepare('INSERT OR IGNORE INTO spot_categories (spotId, categoryId) VALUES (?, ?)').run(spotDbId, catId);
  });

  // Activities-ийг яг адилхан холбоос хүснэгтэд хийнэ
  (spot.activities || []).filter(Boolean).forEach(activityName => {
    const actId = ensureLookup('activities', activityName);
    if (!actId) return;
    db.prepare('INSERT OR IGNORE INTO spot_activities (spotId, activityId) VALUES (?, ?)').run(spotDbId, actId);
  });
};

const run = () => {
  initDB();

  /*spots хүснэгтийг огт устгахгүй. Харин холбоос хүснэгтүүдийг (категори/үйл ажиллагаа) бүхэлд нь цэвэрлэнэ.
  Seed хийхэд холбоосууд давхардаж/хуучирч болох тул цэвэрлээд дахин үүсгэнэ.
  reviews-тэй холбоотой spots устгахгүй байх зорилготой. */
  
  db.exec('DELETE FROM spot_categories; DELETE FROM spot_activities;');

  const spots = readSpotsJson();
  spots.forEach((spot, index) => seedSpot(spot, index));

  console.log(`Seeded ${spots.length} spots (preserved existing reviews).`);
};

run();
