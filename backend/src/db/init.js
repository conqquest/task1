const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function initDB() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    const schemaQuery = fs.readFileSync(schemaPath, { encoding: 'utf8' });
    const seedQuery = fs.readFileSync(seedPath, { encoding: 'utf8' });

    console.log('Initializing database schema...');
    await pool.query(schemaQuery);
    console.log('Database schema initialized.');

    console.log('Seeding database...');
    await pool.query(seedQuery);
    console.log('Database seeded.');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = initDB;
