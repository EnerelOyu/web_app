import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sync spots from JSON file to database
 * This script reads spots.json and updates the database with the latest data
 */
export function syncSpotsFromJSON() {
  try {
    console.log('🔄 Синхрончлол эхэллээ: spots.json → database');

    // Read spots.json
    const jsonPath = path.join(__dirname, '../../frontend/json/spots.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    if (!jsonData.spots || !Array.isArray(jsonData.spots)) {
      throw new Error('Invalid spots.json format');
    }

    let updatedCount = 0;
    let insertedCount = 0;
    let errorCount = 0;

    // Prepare statements
    const checkStmt = db.prepare('SELECT spotId FROM spots WHERE spotId = ?');
    const updateStmt = db.prepare(`
      UPDATE spots
      SET name = ?,
          area = ?,
          category = ?,
          rating = ?,
          price = ?,
          priceText = ?,
          ageRange = ?,
          detailLocation = ?,
          openingHours = ?,
          status = ?,
          imgMainUrl = ?,
          img2Url = ?,
          img3Url = ?,
          mapSrc = ?,
          descriptionLong = ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE spotId = ?
    `);
    const insertStmt = db.prepare(`
      INSERT INTO spots (
        spotId, name, area, category, rating, price, priceText,
        ageRange, detailLocation, openingHours, status,
        imgMainUrl, img2Url, img3Url, mapSrc, descriptionLong
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Clear existing junction tables
    const clearCategoriesStmt = db.prepare('DELETE FROM spot_categories WHERE spotId = ?');
    const clearActivitiesStmt = db.prepare('DELETE FROM spot_activities WHERE spotId = ?');

    // Prepare category and activity statements
    const getCategoryStmt = db.prepare('SELECT id FROM categories WHERE name = ?');
    const insertCategoryStmt = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    const linkCategoryStmt = db.prepare('INSERT OR IGNORE INTO spot_categories (spotId, categoryId) VALUES (?, ?)');

    const getActivityStmt = db.prepare('SELECT id FROM activities WHERE name = ?');
    const insertActivityStmt = db.prepare('INSERT OR IGNORE INTO activities (name) VALUES (?)');
    const linkActivityStmt = db.prepare('INSERT OR IGNORE INTO spot_activities (spotId, activityId) VALUES (?, ?)');

    // Process each spot
    for (const spot of jsonData.spots) {
      try {
        const exists = checkStmt.get(spot.spotId);

        if (exists) {
          // Update existing spot
          updateStmt.run(
            spot.name,
            spot.area,
            spot.category || '',
            spot.rating,
            spot.price,
            spot.priceText,
            spot.ageRange,
            spot.detailLocation,
            spot.openingHours,
            spot.status,
            spot.imgMainUrl,
            spot.img2Url,
            spot.img3Url,
            spot.mapSrc,
            spot.descriptionLong,
            spot.spotId
          );
          updatedCount++;
        } else {
          // Insert new spot
          insertStmt.run(
            spot.spotId,
            spot.name,
            spot.area,
            spot.category || '',
            spot.rating,
            spot.price,
            spot.priceText,
            spot.ageRange,
            spot.detailLocation,
            spot.openingHours,
            spot.status,
            spot.imgMainUrl,
            spot.img2Url,
            spot.img3Url,
            spot.mapSrc,
            spot.descriptionLong
          );
          insertedCount++;
        }

        // Handle categories
        if (spot.category) {
          clearCategoriesStmt.run(spot.spotId);
          const categories = spot.category.split(',').map(c => c.trim()).filter(Boolean);

          for (const categoryName of categories) {
            insertCategoryStmt.run(categoryName);
            const category = getCategoryStmt.get(categoryName);
            if (category) {
              linkCategoryStmt.run(spot.spotId, category.id);
            }
          }
        }

        // Handle activities
        if (spot.activities && Array.isArray(spot.activities)) {
          clearActivitiesStmt.run(spot.spotId);

          for (const activityName of spot.activities) {
            insertActivityStmt.run(activityName);
            const activity = getActivityStmt.get(activityName);
            if (activity) {
              linkActivityStmt.run(spot.spotId, activity.id);
            }
          }
        }

      } catch (error) {
        console.error(`❌ Алдаа spot ${spot.spotId} (${spot.name}):`, error.message);
        errorCount++;
      }
    }

    console.log('✅ Синхрончлол дууслаа:');
    console.log(`   📝 Шинэчлэгдсэн: ${updatedCount} spots`);
    console.log(`   ➕ Нэмэгдсэн: ${insertedCount} spots`);
    if (errorCount > 0) {
      console.log(`   ⚠️  Алдаа: ${errorCount} spots`);
    }

    return { success: true, updated: updatedCount, inserted: insertedCount, errors: errorCount };

  } catch (error) {
    console.error('❌ Синхрончлол амжилтгүй:', error);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncSpotsFromJSON();
  process.exit(0);
}
