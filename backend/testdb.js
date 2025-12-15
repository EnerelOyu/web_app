import express from 'express'
import Database from 'better-sqlite3'
const app = express()
const port = 3000

const db = new Database('ayalgo.db');

app.get("/api/spots", (req, res)=>{
    const stmt = db.prepare('SELECT * FROM spots WHERE spotId = ?');
    const user = stmt.get('Charlie');
    console.log(spots.name, spots.spotId); 
})