import express from 'express';
import cors from 'cors';
import db, { initDB } from './database/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initDB();

const mapSpotRow = (spotRow) => {
  // fetch activities + categories
  const activities = db.prepare(`
    SELECT a.name FROM activities a
    JOIN spot_activities sa ON sa.activityId = a.id
    WHERE sa.spotId = ?
  `).all(spotRow.id).map(r => r.name);

  const categories = db.prepare(`
    SELECT c.name FROM categories c
    JOIN spot_categories sc ON sc.categoryId = c.id
    WHERE sc.spotId = ?
  `).all(spotRow.id).map(r => r.name);

  return {
    spotId: spotRow.id,
    name: spotRow.name,
    area: spotRow.area,
    category: categories.length > 0 ? categories.join(', ') : spotRow.category,
    activities,
    rating: spotRow.rating,
    price: spotRow.price,
    priceText: spotRow.priceText,
    ageRange: spotRow.ageRange,
    detailLocation: spotRow.detailLocation,
    openingHours: spotRow.openingHours,
    status: spotRow.status,
    imgMainUrl: spotRow.imgMainUrl,
    img2Url: spotRow.img2Url,
    img3Url: spotRow.img3Url,
    mapSrc: spotRow.mapSrc,
    descriptionLong: spotRow.descriptionLong,
    infoPageHref: '../code/index.html#/spot-info'
  };
};

app.get('/api/spots', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM spots ORDER BY id').all();
    const payload = rows.map(mapSpotRow);
    res.json({ spots: payload });
  } catch (err) {
    console.error('Error reading spots:', err);
    res.status(500).json({ error: 'Failed to load spots' });
  }
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
