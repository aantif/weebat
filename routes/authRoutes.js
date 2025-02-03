// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Page de connexion
router.get('/login', (req, res) => {
  res.render('login'); // -> login.ejs
});

// Traitement du login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).send('Utilisateur introuvable');
    }

    // Comparer les mots de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send('Mot de passe incorrect');
    }

    // OK => stocker des infos en session
    req.session.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName
    };
    res.redirect('/'); // Retour à la landing (ou un dashboard)
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// Page d’inscription
router.get('/signup', (req, res) => {
  res.render('signup'); // -> signup.ejs
});

// Traitement de l’inscription
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).send('Email déjà enregistré');
    }

    // Créer l’utilisateur
    const newUser = await User.createUser(fullName, email, password);

    // Stocker en session
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName
    };
    res.redirect('/'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// On récupère les fonctions du contrôleur
const {
  getSignup,
  postSignup,
  getPayment,
  postPayment,
  getPaymentSuccess,
  getPaymentError
} = require('../controllers/authController');

// Routes
router.get('/signup', getSignup);       // Affiche le formulaire d’inscription
router.post('/signup', postSignup);     // Traitement du formulaire d’inscription

router.get('/payment', getPayment);     // Affiche la page de paiement
router.post('/payment', postPayment);   // Traitement du paiement

router.get('/payment/success', getPaymentSuccess);
router.get('/payment/error', getPaymentError);

module.exports = router;


// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
