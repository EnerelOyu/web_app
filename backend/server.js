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
  clearPlan,
  getReviewsBySpotId,
  createReview,
  getReviewsByGuideId,
  createGuideReview
} from './database/db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'frontend', 'assets', 'images', 'guide-img');
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

const buildBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

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

const toAbsoluteUrl = (req, assetPath) => {
  if (!assetPath) return assetPath;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  const normalized = normalizeAssetPath(assetPath);
  if (normalized.startsWith('/')) {
    return `${buildBaseUrl(req)}${normalized}`;
  }
  return normalized;
};

// Static files - serve frontend static assets
app.use('/assets', express.static(path.join(__dirname, '..', 'frontend', 'assets')))
// Serve frontend SPA
app.use(express.static(path.join(__dirname, '..', 'frontend')))

// Initialize database
initDB();

const mapSpotRow = (spotRow, req) => {
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
    imgMainUrl: toAbsoluteUrl(req, spotRow.imgMainUrl),
    img2Url: toAbsoluteUrl(req, spotRow.img2Url),
    img3Url: toAbsoluteUrl(req, spotRow.img3Url),
    mapSrc: toAbsoluteUrl(req, spotRow.mapSrc),
    descriptionLong: spotRow.descriptionLong,
    infoPageHref: '../code/index.html#/spot-info'
  };
};

// frontend-ээс guide мэдээлэл ирэхэд DB-д хадгална
app.post('/api/guides', upload.single('profileImage'), (req, res) => {
  try {
    const guideData = req.body;
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

    const jsonPath = path.join(__dirname, '..', 'frontend', 'data', 'guides.json');
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
    const payload = guides.map((guide) => ({
      ...guide,
      profileImgUrl: toAbsoluteUrl(
        req,
        guide.profileImgUrl || '/assets/images/guide-img/default-profile.svg'
      )
    }));
    res.json({ guides: payload });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/spots', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM spots ORDER BY spotId').all();
    const payload = rows.map((row) => mapSpotRow(row, req));
    res.json({ spots: payload });
  } catch (err) {
    console.error('Error reading spots:', err);
    res.status(500).json({ error: 'Failed to load spots' });
  }
});

// ===== PLAN API ENDPOINTS =====

// Get or create plan for user
app.get('/api/plans/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    let plan = getPlanByUserId(userId);

    // Create plan if doesn't exist
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

// Get all spots in a plan
app.get('/api/plans/:userId/spots', (req, res) => {
  try {
    const { userId } = req.params;
    let plan = getPlanByUserId(userId);

    if (!plan) {
      return res.json({ spots: [] });
    }

    const spots = getPlanSpots(plan.id);
    const payload = spots.map((row) => mapSpotRow(row, req));

    res.json({ spots: payload });
  } catch (error) {
    console.error('Error getting plan spots:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add spot to plan
app.post('/api/plans/:userId/spots', (req, res) => {
  try {
    const { userId } = req.params;
    const { spotId } = req.body;

    if (!spotId) {
      return res.status(400).json({ success: false, error: 'spotId is required' });
    }

    // Get or create plan
    let plan = getPlanByUserId(userId);
    if (!plan) {
      const result = createPlan(userId);
      plan = { id: result.planId };
    }

    // Add spot to plan
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

// Remove spot from plan
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

// Update plan notes
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

// Clear all spots from plan
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

// ===== REVIEW API ENDPOINTS =====

// Get all reviews for a specific spot
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

// Create a new review for a spot
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

// ===== GUIDE REVIEW API ENDPOINTS =====

// Get all reviews for a specific guide
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

// Create a new review for a guide
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

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
