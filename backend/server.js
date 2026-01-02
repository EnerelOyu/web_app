import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import db, {
  initDB,
  insertGuide,
  getAllGuides,
  createPlan,
  getPlanByUserId,
  addSpotToPlan,
  removeSpotFromPlan,
  getPlanSpots,
  updatePlanNotes,
  updatePlanSpotTitle,
  updatePlanSpotDescription,
  clearPlan,
  getReviewsBySpotId,
  createReview,
  getReviewsByGuideId,
  createGuideReview
} from './database/db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Guide зураг upload хийх тохиргоо
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'frontend', 'assets', 'images', 'guide-img');
    //directory байхгүй бол үүсгэх
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // хавтас руу хадгалах
    cb(null, uploadDir);
  },
  //file name өгөх
  filename: (req, file, cb) => {
    const uniqueName = `guide_${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });
//express app үүсгэх
const app = express()
//port байвал ашиглана, үгүй бол 3000
const port = process.env.PORT || 3000;

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://maps.googleapis.com"
].join('; ');

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', cspDirectives);
  next();
});
//cors зөвшөөрөх
app.use(cors());
// json body-г parse хийх 
app.use(express.json());

//request-аас base URL үүсгэх
const buildBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;
//asset path-ийг normalize хийх
const normalizeAssetPath = (assetPath) => {
  if (!assetPath) return assetPath;
  if (assetPath.startsWith('/files/guide-img/')) {
    return assetPath.replace('/files/guide-img/', '/assets/images/guide-img/');
  }
  if (assetPath.startsWith('./assets/')) return assetPath.slice(1);
  if (assetPath.startsWith('../assets/')) return assetPath.slice(2);
  if (assetPath.startsWith('assets/')) return `/${assetPath}`;
  return assetPath;
};
//asset path-ийг absolute URL болгох
const toAbsoluteUrl = (req, assetPath) => {
  if (!assetPath) return assetPath;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  const normalized = normalizeAssetPath(assetPath);
  if (normalized.startsWith('/')) {
    return `${buildBaseUrl(req)}${normalized}`;
  }
  return normalized;
};

// assets хавтас руу static file serve хийх
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')))
// frontend SPA-ийн root static serve 
app.use(express.static(path.join(__dirname, '..', 'frontend')))

// DB tables үүсгэх
initDB();

//DB -с spot мэдээллийг авч frontend-д тохирох хэлбэрт хөрвүүлнэ
const mapSpotRow = (spotRow, req) => {
  // activities болон categories-г join хийж авах
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
    // customTitle байвал ашиглах, үгүй бол анхны нэр
    name: spotRow.customTitle || spotRow.name,
    area: spotRow.area,

    //categories-г comma-гаар тусгаарласан string болгох
    category: categories.length > 0 ? categories.join(', ') : spotRow.category,
    activities,
    rating: spotRow.rating,
    price: spotRow.price,
    priceText: spotRow.priceText,
    ageRange: spotRow.ageRange,
    detailLocation: spotRow.detailLocation,
    openingHours: spotRow.openingHours,
    status: spotRow.status,
    //зурагын URL-үүдийг absolute болгох
    imgMainUrl: toAbsoluteUrl(req, spotRow.imgMainUrl),
    img2Url: toAbsoluteUrl(req, spotRow.img2Url),
    img3Url: toAbsoluteUrl(req, spotRow.img3Url),
    mapSrc: toAbsoluteUrl(req, spotRow.mapSrc),
    // customDescription байвал ашиглах, үгүй бол анхны тайлбар
    descriptionLong: spotRow.customDescription || spotRow.descriptionLong,
    infoPageHref: '../code/index.html#/spot-info'
  };
};

// frontend-ээс guide мэдээлэл ирэхэд DB-д хадгална
app.post('/api/guides', upload.single('profileImage'), (req, res) => {
  try {
    const guideData = req.body;
    //profile зураг оруулагүй бол default зураг ашиглах
    const defaultProfileImg = '/assets/images/guide-img/default-profile.svg';
    let profileImgUrl = defaultProfileImg;
    if (req.file) {
      profileImgUrl = `/assets/images/guide-img/${req.file.filename}`;
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

    //guides.json файлын зам
    const jsonPath = path.join(__dirname, '..', 'frontend', 'data', 'guides.json');
    //guides.json файлыг уншиж parse хийх
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    //шинэ guide объектыг үүсгэж JSON-д нэмэх
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
    //DB-с бүх guide мэдээллийг авах
    const guides = getAllGuides();

    // Mapping объектууд
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

    const payload = guides.map((guide) => {
      // area-г монгол хэлбэр рүү хөрвүүлэх (хэрэв англи хэлээр байвал)
      let area = guide.area;
      if (regionMap[guide.area]) {
        area = regionMap[guide.area];
      }

      // category-г монгол хэлбэр рүү хөрвүүлэх
      let category = guide.category;
      if (categoryMap[guide.category]) {
        category = categoryMap[guide.category];
      }

      // languages-г монгол хэлбэр рүү хөрвүүлэх
      let languages = guide.languages;
      if (languages) {
        // comma-гаар тусгаарласан string эсвэл нэг хэл байж болно
        const langArray = languages.split(',').map(l => l.trim());
        const translatedLangs = langArray.map(lang => languageMap[lang] || lang);
        languages = translatedLangs.join(', ');
      }

      // experienceLevel-ийг монгол хэлбэр рүү хөрвүүлэх
      let experienceLevel = guide.experienceLevel;
      if (experienceMap[guide.experienceLevel]) {
        experienceLevel = experienceMap[guide.experienceLevel];
      }

      return {
        ...guide,
        area,
        category,
        languages,
        experienceLevel,
        profileImgUrl: toAbsoluteUrl(
          req,
          guide.profileImgUrl || '/assets/images/guide-img/default-profile.svg'
        )
      };
    });

    res.json({ guides: payload });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/spots', (req, res) => {
  try {
    //spot мэдээллийг DB-с авч frontend-д тохирох хэлбэрт хөрвүүлнэ
    const rows = db.prepare('SELECT * FROM spots ORDER BY spotId').all();
    const payload = rows.map((row) => mapSpotRow(row, req));
    res.json({ spots: payload });
  } catch (err) {
    console.error('Error reading spots:', err);
    res.status(500).json({ error: 'Failed to load spots' });
  }
});


// тухайн хэрэглэгчийн төлөвлөгөөг авах, байхгүй бол шинээр үүсгэх
app.get('/api/plans/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    let plan = getPlanByUserId(userId);

    if (!plan) {
      const result = createPlan(userId);
      plan = { id: result.planId, userId, notes: '', createdAt: new Date().toISOString() };
    }

    res.json({ plan });
  } catch (error) {
    console.error('Error getting plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//plan-д нэмэгдсэн spot-уудыг авах
app.get('/api/plans/:userId/spots', (req, res) => {
  try {
    const { userId } = req.params;
    //userId-аар төлөвлөгөөг авах
    let plan = getPlanByUserId(userId);

    if (!plan) {
      return res.json({ spots: [] });
    }
    //plan.id-аар төлөвлөгөөний spot-уудыг авах
    const spots = getPlanSpots(plan.id);
    const payload = spots.map((row) => mapSpotRow(row, req));

    res.json({ spots: payload });
  } catch (error) {
    console.error('Error getting plan spots:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// plan-д шинэ spot нэмэх
app.post('/api/plans/:userId/spots', (req, res) => {
  try {
    const { userId } = req.params;
    const { spotId } = req.body;

    if (!spotId) {
      return res.status(400).json({ success: false, error: 'spotId is required' });
    }

    // plan-ийг userId-аар авах, байхгүй бол шинээр үүсгэх
    let plan = getPlanByUserId(userId);
    if (!plan) {
      const result = createPlan(userId);
      plan = { id: result.planId };
    }

    // plan.id-д spotId-г нэмэх
    const result = addSpotToPlan(plan.id, spotId);

    if (!result.success && result.error === 'exists') {
      return res.status(409).json({ success: false, error: 'exists', message: 'Spot already in plan' });
    }

    res.status(201).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error adding spot to plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//plan-аас spot устгах
app.delete('/api/plans/:userId/spots/:spotId', (req, res) => {
  try {
    const { userId, spotId } = req.params;

    const plan = getPlanByUserId(userId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const removed = removeSpotFromPlan(plan.id, spotId);

    if (removed) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Spot not found in plan' });
    }
  } catch (error) {
    console.error('Error removing spot from plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// plan-ийн тэмдэглэл шинэчлэх
app.put('/api/plans/:userId/notes', (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;

    const plan = getPlanByUserId(userId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const updated = updatePlanNotes(plan.id, notes || '');

    if (updated) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update notes' });
    }
  } catch (error) {
    console.error('Error updating plan notes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// plan spot-ийн customTitle шинэчлэх
app.put('/api/plans/:userId/spots/:spotId/title', (req, res) => {
  try {
    const { userId, spotId } = req.params;
    const { customTitle } = req.body;

    const plan = getPlanByUserId(userId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const updated = updatePlanSpotTitle(plan.id, spotId, customTitle);

    if (updated) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Spot not found in plan' });
    }
  } catch (error) {
    console.error('Error updating spot title:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// plan spot-ийн customDescription шинэчлэх
app.put('/api/plans/:userId/spots/:spotId/description', (req, res) => {
  try {
    const { userId, spotId } = req.params;
    const { description } = req.body;

    const plan = getPlanByUserId(userId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const updated = updatePlanSpotDescription(plan.id, spotId, description);

    if (updated) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Spot not found in plan' });
    }
  } catch (error) {
    console.error('Error updating spot description:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// plan дахь бүх spot-уудыг устгах
app.delete('/api/plans/:userId/spots', (req, res) => {
  try {
    const { userId } = req.params;

    const plan = getPlanByUserId(userId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const deletedCount = clearPlan(plan.id);

    res.json({ success: true, deletedCount });
  } catch (error) {
    console.error('Error clearing plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


//spotid-аар тухайн spot-ийн бүх review-уудыг авах
app.get('/api/spots/:spotId/reviews', (req, res) => {
  try {
    const { spotId } = req.params;
    const reviews = getReviewsBySpotId(spotId);

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//spot-д шинэ review нэмэх
app.post('/api/spots/:spotId/reviews', (req, res) => {
  try {
    const { spotId } = req.params;
    const { userName, comment, rating } = req.body;

    if (!userName || !comment || rating === undefined) {
      return res.status(400).json({
        success: false,
        error: 'userName, comment, and rating are required'
      });
    }

    const result = createReview(spotId, userName, comment, rating);

    res.status(201).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// guideId-аар тухайн guide-ийн бүх review-уудыг авах
app.get('/api/guides/:guideId/reviews', (req, res) => {
  try {
    const { guideId } = req.params;
    const reviews = getReviewsByGuideId(guideId);

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching guide reviews:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// guide-д шинэ review нэмэх
app.post('/api/guides/:guideId/reviews', (req, res) => {
  try {
    const { guideId } = req.params;
    const { userName, comment, rating } = req.body;

    if (!userName || !comment || rating === undefined) {
      return res.status(400).json({
        success: false,
        error: 'userName, comment, and rating are required'
      });
    }

    const result = createGuideReview(guideId, userName, comment, rating);

    res.status(201).json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creating guide review:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Google Maps Distance Matrix API дуудлага
app.post('/api/distance', async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        error: 'origin and destination are required'
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Google Maps API key not configured'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&language=mn`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return res.status(400).json({
        success: false,
        error: `Google Maps API error: ${data.status}`
      });
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      return res.status(400).json({
        success: false,
        error: 'Unable to calculate distance'
      });
    }

    res.json({
      success: true,
      distance: element.distance.text,
      duration: element.duration.text,
      distanceValue: element.distance.value, // meters
      durationValue: element.duration.value  // seconds
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
