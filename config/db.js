// config/db.js
require('dotenv').config();
const { Pool } = require('pg');

// Création d'un pool de connexions
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

pool.connect()
  .then(() => {
    console.log('Connecté à PostgreSQL (Scaleway).');
  })
  .catch((err) => {
    console.error('Erreur de connexion PostgreSQL :', err.message);
    process.exit(1);
  });

module.exports = pool;
