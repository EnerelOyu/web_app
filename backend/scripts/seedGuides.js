import db, { initDB } from '../database/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read guides.json
const guidesPath = path.join(__dirname, '../../frontend/data/guides.json');
const guidesData = JSON.parse(fs.readFileSync(guidesPath, 'utf-8'));

// Initialize database schema
initDB();

console.log('🌟 Seeding guides...\n');

// Clear existing guides
db.exec('DELETE FROM guides');
console.log('🗑️  Cleared existing guides\n');

const insertGuide = db.prepare(`
  INSERT INTO guides (guideId, lastName, firstName, phone, email, area, category, languages, experienceLevel, profileImgUrl)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let count = 0;
for (const guide of guidesData.guides) {
  const languages = Array.isArray(guide.language) ? guide.language.join(', ') : guide.language;
  
  insertGuide.run(
    guide.guideId,
    guide.lastName,
    guide.firstName,
    guide.phone,
    guide.email,
    guide.area,
    guide.category,
    languages,
    guide.experienceLevel,
    guide.profileImgUrl
  );
  count++;
}

console.log(`✅ Successfully seeded ${count} guides!`);

db.close();
