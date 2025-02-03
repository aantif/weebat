// models/User.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * findByEmail - Récupère un utilisateur par son email
 * @param {string} email 
 * @returns {object | null} utilisateur ou null si non trouvé
 */
async function findByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

/**
 * findById - Récupère un utilisateur par son id
 * @param {number} id 
 * @returns {object | null} utilisateur ou null si non trouvé
 */
async function findById(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

/**
 * createUser - Crée un nouvel utilisateur (hachage du mot de passe, insertion dans la DB)
 * @param {object} userData {
 *   fullName, email, phone, password, 
 *   billingAddress, billingCity, billingPostcode, billingCountry, plan
 * }
 * @returns {object} l’utilisateur créé (ligne insérée)
 */
async function createUser({
  fullName,
  email,
  phone,
  password,
  billingAddress,
  billingCity,
  billingPostcode,
  billingCountry,
  plan
}) {
  // On hash le mot de passe avant de l'insérer
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users 
      ("fullName", email, phone, password, "billingAddress", "billingCity", "billingPostcode", "billingCountry", plan)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING 
      id, 
      "fullName", 
      email, 
      phone, 
      "billingAddress", 
      "billingCity", 
      "billingPostcode", 
      "billingCountry", 
      plan,
      "subscriptionActive",
      "createdAt"
  `;

  const values = [
    fullName,
    email,
    phone || null,
    hashedPassword,
    billingAddress,
    billingCity,
    billingPostcode,
    billingCountry,
    plan
  ];

  const result = await pool.query(query, values);
  return result.rows[0]; 
}

module.exports = {
  findByEmail,
  findById,
  createUser
};
