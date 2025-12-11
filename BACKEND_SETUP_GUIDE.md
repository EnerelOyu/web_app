# Backend Setup Guide - Node.js + Express + SQLite

Энэ заавар нь танай аялалын аппликэйшнд бүрэн backend систем нэмэх алхмуудыг агуулна.

## 📋 Агуулга

1. [Шаардлагатай зүйлс](#шаардлагатай-зүйлс)
2. [Яагаад SQLite вэ?](#яагаад-sqlite-вэ)
3. [Backend бүтэц](#backend-бүтэц)
4. [Алхам алхмаар заавар](#алхам-алхмаар-заавар)
5. [API Endpoints](#api-endpoints)
6. [Frontend Integration](#frontend-integration)

---

## Шаардлагатай зүйлс

### 1. Node.js суулгах
```bash
# Node.js version шалгах
node --version
npm --version

# Хэрэв суугаагүй бол https://nodejs.org/ -аас татах
```

### 2. SQLite - Шаардлагагүй!
SQLite нь Node.js package-аар автоматаар суух болно. Тусдаа database server шаардахгүй.

---

## Яагаад SQLite вэ?

### SQLite давуу тал

| Feature | SQLite | MongoDB | PostgreSQL |
|---------|---------|---------|------------|
| **Setup** | ✅ Хялбар | Средний | Төвөгтэй |
| **Dependencies** | ✅ Байхгүй | MongoDB server | PostgreSQL server |
| **File-based** | ✅ Тийм | Үгүй | Үгүй |
| **Портабл** | ✅ Тийм | Үгүй | Үгүй |
| **Хурд** | ✅ Хурдан (жижиг апп) | Хурдан | Хурдан |
| **Size** | ✅ Хөнгөн | Хүнд | Хүнд |
| **Эхлэгчдэд** | ✅ Маш хялбар | Хялбар | Төвөгтэй |

**Санал:** SQLite - Жижиг ба дунд хэмжээний апп-д хамгийн тохиромжтой!

---

## Backend бүтэц

```
web_app/
├── frontend/                 # Одоогийн frontend код
│   ├── code/
│   ├── json/
│   └── ...
├── backend/                  # ШИНЭ backend folder
│   ├── database/            # SQLite database files
│   │   ├── db.js           # Database connection & setup
│   │   └── schema.sql      # Database schema
│   ├── routes/              # API routes
│   │   ├── spots.js
│   │   ├── reviews.js
│   │   ├── guides.js
│   │   └── plans.js
│   ├── middleware/          # Authentication, etc.
│   │   └── auth.js
│   ├── controllers/         # Business logic
│   │   ├── spotController.js
│   │   ├── reviewController.js
│   │   └── planController.js
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   ├── ayalgo.db           # SQLite database file (auto-generated)
│   └── package.json         # Dependencies
└── README.md
```

---

## Алхам алхмаар заавар

### STEP 1: Backend folder үүсгэх

```bash
cd /Users/edi/Documents/web/web_app
mkdir backend
cd backend
```

### STEP 2: Node.js project эхлүүлэх

```bash
npm init -y
```

### STEP 3: Dependencies суулгах

```bash
# Core dependencies
npm install express better-sqlite3 dotenv cors

# Development dependencies
npm install --save-dev nodemon

# Optional: Authentication
npm install bcryptjs jsonwebtoken

# Optional: Validation
npm install express-validator
```

**Package тайлбар:**
- `express` - Web framework
- `better-sqlite3` - SQLite database driver (хурдан, synchronous)
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `nodemon` - Auto-restart server
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-validator` - Input validation

### STEP 4: .env файл үүсгэх

```bash
# backend/.env
PORT=5000
DB_PATH=./ayalgo.db
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
```

⚠️ **Анхааруулга:** `.env` файлыг `.gitignore`-д нэмэх!

### STEP 5: package.json scripts нэмэх

```json
{
  "name": "ayalgo-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seedDatabase.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### STEP 6: Database холболт (database/db.js)

```javascript
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
```

### STEP 7: Controllers үүсгэх (SQLite ашигласан)

SQLite-д Models байхгүй - Controllers дотроо шууд SQL queries ашиглана.

#### **controllers/spotController.js**
```javascript
import db from '../database/db.js';

// GET /api/spots - Бүх spots-г авах
export const getAllSpots = (req, res) => {
  try {
    const { area, category } = req.query;

    let query = 'SELECT * FROM spots WHERE 1=1';
    const params = [];

    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }

    if (category) {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    const stmt = db.prepare(query);
    const spots = stmt.all(...params);

    // activities-г array болгох
    const spotsWithActivities = spots.map(spot => ({
      ...spot,
      activities: spot.activities ? spot.activities.split(',').map(a => a.trim()) : []
    }));

    res.json({ success: true, data: spotsWithActivities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/spots/:id - Нэг spot авах
export const getSpotById = (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM spots WHERE id = ?');
    const spot = stmt.get(req.params.id);

    if (!spot) {
      return res.status(404).json({ success: false, error: 'Spot олдсонгүй' });
    }

    // activities-г array болгох
    spot.activities = spot.activities ? spot.activities.split(',').map(a => a.trim()) : [];

    res.json({ success: true, data: spot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/spots - Шинэ spot нэмэх
export const createSpot = (req, res) => {
  try {
    const {
      name, area, category, activities, rating, price, priceText,
      ageRange, detailLocation, openingHours, status,
      imgMainUrl, img2Url, img3Url, descriptionLong
    } = req.body;

    // activities array → string
    const activitiesStr = Array.isArray(activities) ? activities.join(', ') : activities;

    const stmt = db.prepare(`
      INSERT INTO spots (
        name, area, category, activities, rating, price, priceText,
        ageRange, detailLocation, openingHours, status,
        imgMainUrl, img2Url, img3Url, descriptionLong
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name, area, category, activitiesStr, rating || 0, price || 0, priceText,
      ageRange || 'Бүх нас', detailLocation, openingHours, status || 'Нээлттэй',
      imgMainUrl, img2Url, img3Url, descriptionLong
    );

    // Шинэ spot-г буцаах
    const newSpot = db.prepare('SELECT * FROM spots WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: newSpot });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/spots/:id - Spot шинэчлэх
export const updateSpot = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if spot exists
    const exists = db.prepare('SELECT id FROM spots WHERE id = ?').get(id);
    if (!exists) {
      return res.status(404).json({ success: false, error: 'Spot олдсонгүй' });
    }

    // activities array → string
    if (Array.isArray(updates.activities)) {
      updates.activities = updates.activities.join(', ');
    }

    // Build UPDATE query dynamically
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    const stmt = db.prepare(`
      UPDATE spots
      SET ${setClause}, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(...values, id);

    // Return updated spot
    const updatedSpot = db.prepare('SELECT * FROM spots WHERE id = ?').get(id);
    res.json({ success: true, data: updatedSpot });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/spots/:id - Spot устгах
export const deleteSpot = (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM spots WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Spot олдсонгүй' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

#### **controllers/reviewController.js**
```javascript
import db from '../database/db.js';

// GET /api/reviews/:spotId - Spot-ын сэтгэгдлүүд
export const getReviewsBySpot = (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM reviews
      WHERE spotId = ?
      ORDER BY createdAt DESC
    `);
    const reviews = stmt.all(req.params.spotId);

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/reviews - Шинэ сэтгэгдэл нэмэх
export const createReview = (req, res) => {
  try {
    const { spotId, userName, comment, rating } = req.body;

    // Validation
    if (!spotId || !userName || !comment || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Бүх талбаруудыг бөглөнө үү'
      });
    }

    // Check if spot exists
    const spotExists = db.prepare('SELECT id FROM spots WHERE id = ?').get(spotId);
    if (!spotExists) {
      return res.status(404).json({ success: false, error: 'Spot олдсонгүй' });
    }

    // Insert review
    const insertStmt = db.prepare(`
      INSERT INTO reviews (spotId, userName, comment, rating)
      VALUES (?, ?, ?, ?)
    `);
    const result = insertStmt.run(spotId, userName, comment, rating);

    // Update spot reviewCount
    const updateStmt = db.prepare(`
      UPDATE spots
      SET reviewCount = reviewCount + 1
      WHERE id = ?
    `);
    updateStmt.run(spotId);

    // Return new review
    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

### STEP 9: Routes үүсгэх

#### **routes/spots.js**
```javascript
import express from 'express';
import {
  getAllSpots,
  getSpotById,
  createSpot,
  updateSpot,
  deleteSpot
} from '../controllers/spotController.js';

const router = express.Router();

router.get('/', getAllSpots);
router.get('/:id', getSpotById);
router.post('/', createSpot);
router.put('/:id', updateSpot);
router.delete('/:id', deleteSpot);

export default router;
```

#### **routes/reviews.js**
```javascript
import express from 'express';
import {
  getReviewsBySpot,
  createReview
} from '../controllers/reviewController.js';

const router = express.Router();

router.get('/:spotId', getReviewsBySpot);
router.post('/', createReview);

export default router;
```

### STEP 8: Main Server файл (server.js)

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db, { initDB } from './database/db.js';
import spotRoutes from './routes/spots.js';
import reviewRoutes from './routes/reviews.js';

// Environment variables
dotenv.config();

// Database schema үүсгэх
initDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Ayalgo API - Running',
    database: 'SQLite',
    version: '1.0.0'
  });
});

app.use('/api/spots', spotRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route олдсонгүй'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server алдаа гарлаа'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} порт дээр ажиллаж байна`);
  console.log(`📊 Database: SQLite (${process.env.DB_PATH || './ayalgo.db'})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.close();
    process.exit(0);
  });
});
```

### STEP 9: Database seed script

#### **scripts/seedDatabase.js**
```javascript
import db, { initDB } from '../database/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedData = () => {
  try {
    console.log('🌱 Database seed эхэллээ...');

    // Schema үүсгэх
    initDB();

    // Хуучин өгөгдлийг устгах
    db.prepare('DELETE FROM reviews').run();
    db.prepare('DELETE FROM spots').run();
    console.log('✅ Хуучин өгөгдөл устгагдлаа');

    // JSON файлаас өгөгдөл уншиx
    const spotsDataPath = path.join(__dirname, '../../frontend/json/spots.json');
    const spotsData = JSON.parse(fs.readFileSync(spotsDataPath, 'utf-8'));

    // Prepared statement
    const insertStmt = db.prepare(`
      INSERT INTO spots (
        name, area, category, activities, rating, price, priceText,
        ageRange, detailLocation, openingHours, status,
        imgMainUrl, img2Url, img3Url, descriptionLong
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Transaction ашиглах (хурд нэмэгдүүлэх)
    const insertMany = db.transaction((spots) => {
      for (const spot of spots) {
        // activities array → string
        const activitiesStr = Array.isArray(spot.activities)
          ? spot.activities.join(', ')
          : spot.activities || '';

        insertStmt.run(
          spot.name,
          spot.area,
          spot.category,
          activitiesStr,
          spot.rating || 0,
          spot.price || 0,
          spot.priceText || '',
          spot.ageRange || 'Бүх нас',
          spot.detailLocation || '',
          spot.openingHours || '',
          spot.status || 'Нээлттэй',
          spot.imgMainUrl || '',
          spot.img2Url || null,
          spot.img3Url || null,
          spot.descriptionLong || ''
        );
      }
    });

    // Execute transaction
    insertMany(spotsData.spots);

    console.log(`✅ ${spotsData.spots.length} spot амжилттай нэмэгдлээ!`);

    // Stats харуулах
    const count = db.prepare('SELECT COUNT(*) as count FROM spots').get();
    console.log(`📊 Нийт spots: ${count.count}`);

    console.log('🎉 Seed амжилттай боллоо!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Алдаа:', error);
    process.exit(1);
  }
};

seedData();
```

### STEP 10: .gitignore файл

```bash
# backend/.gitignore
node_modules/
.env
.DS_Store
*.log
*.db
*.db-shm
*.db-wal
```

⚠️ **Анхааруулга:** SQLite database файлууд (`.db`, `.db-shm`, `.db-wal`) git-д commit хийхгүй байх!

---

## API Endpoints

### Spots API

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/api/spots` | Бүх spots-г авах |
| GET | `/api/spots?area=Төв` | Бүсээр шүүх |
| GET | `/api/spots?category=Соёл` | Категориор шүүх |
| GET | `/api/spots/:id` | ID-аар spot авах |
| POST | `/api/spots` | Шинэ spot үүсгэх |
| PUT | `/api/spots/:id` | Spot шинэчлэх |
| DELETE | `/api/spots/:id` | Spot устгах |

### Reviews API

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/api/reviews/:spotId` | Spot-ын сэтгэгдлүүд |
| POST | `/api/reviews` | Сэтгэгдэл нэмэх |

---

## Frontend Integration

### STEP 1: app-state.js-г SQLite backend API ашиглахаар өөрчлөх

```javascript
// frontend/code/router/app-state.js

const API_URL = 'http://localhost:5000/api';

class AppState {
    constructor() {
        this.planItems = this.loadPlanFromStorage();
        this.currentSpot = null;
        this.spotData = {};
        this.guideData = {};

        // Load data from API instead of JSON files
        this.loadSpotDataFromAPI();
        this.loadGuideData();
    }

    async loadSpotDataFromAPI() {
        try {
            const response = await fetch(`${API_URL}/spots`);
            const data = await response.json();

            if (data.success) {
                // Transform SQLite data to match existing structure
                data.data.forEach(spot => {
                    const id = this.generateSpotId(spot.name);
                    this.spotData[id] = {
                        id: id,
                        title: spot.name.toUpperCase(),
                        rating: spot.rating.toString(),
                        cate: spot.category,
                        status: spot.status,
                        time: spot.openingHours,
                        img1: spot.imgMainUrl,
                        img2: spot.img2Url || spot.imgMainUrl,
                        img3: spot.img3Url || spot.imgMainUrl,
                        region: spot.area,
                        location: spot.detailLocation,
                        age: spot.ageRange,
                        price: spot.priceText,
                        schedule: spot.openingHours,
                        description: spot.descriptionLong,
                        activities: Array.isArray(spot.activities)
                            ? spot.activities.join(', ')
                            : spot.activities,
                        dbId: spot.id  // SQLite ID хадгалах
                    };
                });

                this.dispatchStateChange('spotData', this.spotData);
                console.log(`✅ ${data.data.length} spots API-аас ачаалагдлаа`);
            }
        } catch (error) {
            console.error('❌ API-аас өгөгдөл татахад алдаа:', error);
            // Fallback to JSON file
            console.log('⚠️ JSON файлаас өгөгдөл ачаалж байна...');
            this.loadSpotData();
        }
    }

    // Save review to API
    async saveReview(spotId, userName, comment, rating) {
        try {
            const spot = this.getSpot(spotId);
            if (!spot || !spot.dbId) {
                console.error('Spot database ID олдсонгүй');
                // Fallback: localStorage-д хадгалах
                return this.saveReviewToLocalStorage(spotId, userName, comment, rating);
            }

            const response = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    spotId: spot.dbId,
                    userName,
                    comment,
                    rating
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('✅ Сэтгэгдэл database-д хадгалагдлаа');
                return true;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('❌ Сэтгэгдэл хадгалахад алдаа:', error);
            // Fallback: localStorage
            return this.saveReviewToLocalStorage(spotId, userName, comment, rating);
        }
    }

    // Fallback: localStorage-д хадгалах
    saveReviewToLocalStorage(spotId, userName, comment, rating) {
        try {
            const storageKey = `ayalgo-reviews-${spotId}`;
            const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');

            existing.unshift({
                userName,
                comment,
                rating,
                date: new Date().toISOString()
            });

            localStorage.setItem(storageKey, JSON.stringify(existing));
            console.log('⚠️ Сэтгэгдэл localStorage-д хадгалагдлаа (fallback)');
            return true;
        } catch (error) {
            console.error('❌ localStorage-д хадгалахад алдаа:', error);
            return false;
        }
    }

    // Load reviews from API
    async loadReviews(spotId) {
        try {
            const spot = this.getSpot(spotId);
            if (!spot || !spot.dbId) {
                return [];
            }

            const response = await fetch(`${API_URL}/reviews/${spot.dbId}`);
            const data = await response.json();

            if (data.success) {
                return data.data.map(review => ({
                    bogin: review.userName,
                    urt: review.comment,
                    unelgee: review.rating,
                    date: new Date(review.createdAt).toISOString().split('T')[0]
                }));
            }
        } catch (error) {
            console.error('❌ Сэтгэгдэл ачаалахад алдаа:', error);
        }
        return [];
    }
}
```

### STEP 2: ag-spot-review.js-г API холбох

```javascript
// frontend/code/component/spot-info/ag-spot-review.js

async connectedCallback() {
    this.spotId = this.getAttribute('spot-id') || 'default';
    this.css();

    // Load reviews from API
    await this.loadReviewsFromAPI();

    this.render();
}

async loadReviewsFromAPI() {
    try {
        // Load from API
        const apiReviews = await window.appState.loadReviews(this.spotId);

        // Load default reviews
        const defaultReviews = [...]; // Your default reviews

        // Merge: API reviews first, then defaults
        this.reviews = [...apiReviews, ...defaultReviews];
    } catch (error) {
        console.error('Error loading reviews:', error);
        this.loadReviews(); // Fallback to default
    }
}

async handleFormSubmit() {
    const name = this.querySelector('#name').value;
    const comment = this.querySelector('#comment').value;

    if (name && comment) {
        // Save to API/localStorage
        const success = await window.appState.saveReview(
            this.spotId,
            name,
            comment,
            5.0
        );

        if (success) {
            // Add to local reviews
            const newReview = {
                bogin: name,
                urt: comment,
                unelgee: 5.0,
                date: new Date().toISOString().split('T')[0]
            };

            this.reviews.unshift(newReview);
            this.render();
            this.querySelector('#commentForm').reset();
            alert('✅ Сэтгэгдэл амжилттай илгээгдлээ!');
        } else {
            alert('❌ Алдаа гарлаа. Дахин оролдоно уу.');
        }
    }
}
```

---

## Server ажиллуулах

```bash
# Backend folder руу орох
cd /Users/edi/Documents/web/web_app/backend

# Database seed хийх (эхний удаа)
npm run seed

# Development server эхлүүлэх
npm run dev

# Production
npm start
```

---

## Тест хийх

### Postman эсвэл curl ашиглах

```bash
# GET all spots
curl http://localhost:5000/api/spots

# GET spots by area
curl http://localhost:5000/api/spots?area=Төв

# POST new review
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "spotId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "userName": "Бат",
    "comment": "Гайхалтай газар!",
    "rating": 5
  }'
```

---

## Дараагийн алхмууд

1. **Authentication System**
   - User registration/login
   - JWT tokens
   - Protected routes

2. **Admin Panel**
   - Spot CRUD interface
   - Review moderation

3. **Real-time Features**
   - Socket.io нэмэх
   - Live notifications

4. **File Upload**
   - Image upload
   - Multer ашиглах

5. **Deployment**
   - Backend: Heroku/Railway/Render
   - Database: MongoDB Atlas
   - Frontend: Netlify/Vercel

---

## Туслагдах материал

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/)
- [REST API Best Practices](https://restfulapi.net/)

---

## Асуудал гарвал

1. MongoDB холбогдохгүй байвал:
   - MongoDB service ажиллаж байгаа эсэхийг шалгах
   - MONGODB_URI зөв эсэхийг шалгах

2. CORS алдаа:
   - Frontend болон Backend ялгаатай портуудад байвал CORS шаардлагатай

3. Port already in use:
   ```bash
   lsof -i :5000  # Процесс олох
   kill -9 <PID>  # Процесс зогсоох
   ```

---

Амжилт хүсье! 🚀
