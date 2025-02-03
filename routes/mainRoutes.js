// routes/mainRoutes.js
const express = require('express');
const router = express.Router();

// Landing page
router.get('/', (req, res) => {
  // user: req.session.user si l’utilisateur est connecté
  res.render('landing', { user: req.session.user });
});

// Page "Fonctionnalités"
router.get('/features', (req, res) => {
  res.render('features', { user: req.session.user });
});

// Page "Tarifs"
router.get('/pricing', (req, res) => {
  res.render('pricing', { user: req.session.user });
});

// Page "Contact"
router.get('/contact', (req, res) => {
  res.render('contact', { user: req.session.user });
});

// Page "Demo"
router.get('/demo', (req, res) => {
    // Vous pouvez vérifier si user est connecté pour autoriser la démo
    // Par ex. if (!req.session.user) { return res.redirect('/login'); }
    res.render('demo', { user: req.session.user });
  });

module.exports = router;
