import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import db, { initDB, insertGuide, getAllGuides } from './database/db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'frontend', 'files', 'guide-img');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `guide_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Static files
app.use('/files', express.static(path.join(__dirname, '..', 'frontend', 'files')))

// Initialize database
initDB();

const mapSpotRow = (spotRow) => {
  // fetch activities + categories
  const activities = db.prepare(`
    SELECT a.name FROM activities a
    JOIN spot_activities sa ON sa.activityId = a.id
    WHERE sa.spotId = ?
  `).all(spotRow.spotId).map(r => r.name);

  const categories = db.prepare(`
    SELECT c.name FROM categories c
    JOIN spot_categories sc ON sc.categoryId = c.id
    WHERE sc.spotId = ?
  `).all(spotRow.spotId).map(r => r.name);

  return {
    spotId: spotRow.spotId,
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

// frontend-ээс guide мэдээлэл ирэхэд DB-д хадгална
app.post('/api/guides', upload.single('profileImage'), (req, res) => {
  try {
    const guideData = req.body;
    const defaultProfileImg = '/files/guide-img/default-profile.svg';
    let profileImgUrl = defaultProfileImg;
    if (req.file) {
      profileImgUrl = `/files/guide-img/${req.file.filename}`;
    }

    const result = insertGuide({ ...guideData, profileImgUrl });

    // JSON файлд хадгалах
    const regionMap = {
      tuv: 'Төв',
      zuun: 'Зүүн',
      baruun: 'Баруун',
      hangai: 'Хангай',
      altai: 'Алтай',
      govi: 'Говь'
    };
    const categoryMap = {
      culture: 'Соёл',
      resort: 'Амралт сувилал',
      adventure: 'Адал явдалт',
      nature: 'Байгаль',
      montain: 'Ууланд гарах'
    };
    const languageMap = {
      mongolian: 'Монгол',
      english: 'Англи',
      russian: 'Орос',
      chinese: 'Хятад',
      japanese: 'Япон'
    };
    const experienceMap = {
      '1': '1 жил ба түүнээс доош',
      '1-5': '1 - 5 жил',
      '5++': '5 -аас дээш жил'
    };

    const jsonPath = path.join(__dirname, '..', 'frontend', 'json', 'guides.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const newGuide = {
      guideId: result.guideId,
      lastName: guideData.lastName,
      firstName: guideData.firstName,
      phone: guideData.phone,
      email: guideData.email,
      area: guideData.area ? regionMap[guideData.area] || guideData.area : null,
      category: guideData.category ? categoryMap[guideData.category] || guideData.category : null,
      language: guideData.languages ? (Array.isArray(guideData.languages) ? guideData.languages.map(l => languageMap[l] || l) : [languageMap[guideData.languages] || guideData.languages]) : [],
      experienceLevel: guideData.experienceLevel ? experienceMap[guideData.experienceLevel] || guideData.experienceLevel : null,
      profileImgUrl: profileImgUrl
    };
    jsonData.guides.push(newGuide);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

    res.status(201).json({ success: true, id: result.id, guideId: result.guideId });
  } catch (error) {
    console.error('Error inserting guide:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
//DB-д байгаа бүх guide жагсаалтыг авч буцаана
app.get('/api/guides', (req, res) => {
  try {
    const guides = getAllGuides();
    res.json({ guides });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/spots', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM spots ORDER BY spotId').all();
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
