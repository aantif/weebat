const express = require('express');
const router = express.Router();

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
