// Exemple : on stocke les utilisateurs dans un tableau en mémoire
// Pour un usage PRODUCTION => Stocker dans BDD (MongoDB, PostgreSQL, etc.)
const users = [];

// Pour la facture PDF et l’email
const { generateInitialInvoice } = require('../utils/pdfGenerator');
const { sendWelcomeEmail } = require('../utils/email');

// 1. GET /auth/signup
function getSignup(req, res) {
  // Afficher le formulaire d’inscription
  // (Assure-toi d’avoir un fichier signup.ejs dans /views)
  res.render('signup');
}

// 2. POST /auth/signup
async function postSignup(req, res) {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      billingAddress,
      billingCity,
      billingPostcode,
      billingCountry,
      plan
    } = req.body;

    // Exemple très basique : On crée un objet user
    const newUser = {
      id: Date.now().toString(), // petit ID unique basique
      fullName,
      email,
      phone,
      password, // en prod: hasher ! (bcrypt)
      billingAddress,
      billingCity,
      billingPostcode,
      billingCountry,
      plan
    };

    // On stocke en mémoire
    users.push(newUser);
    
    // On peut stocker l’utilisateur dans la session
    req.session.user = newUser;

    // Optionnel : envoyer un email de bienvenue (sans PDF pour l’instant)
    // await sendWelcomeEmail(email, fullName, null);

    // Redirige vers la page de paiement
    res.redirect('/auth/payment');
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.redirect('/auth/signup'); // Ou render error
  }
}

// 3. GET /auth/payment
function getPayment(req, res) {
  const user = req.session.user;
  if (!user) {
    // Si pas d'utilisateur en session, on redirige vers l'inscription
    return res.redirect('/auth/signup');
  }

  // Calcul du prix selon le plan (exemple)
  const subscriptionPrice = getSubscriptionPrice(user.plan);

  // On affiche la page payment.ejs (à créer)
  res.render('payment', {
    user,
    subscriptionPrice
  });
}

// 4. POST /auth/payment
async function postPayment(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/auth/signup');
    }

    const { paymentMethod } = req.body;
    const subscriptionPrice = getSubscriptionPrice(user.plan);

    // 4.1 Simulation du paiement (PayPal ou Stripe)
    // En PRODUCTION, il faudrait ici:
    // - Soit rediriger vers la page PayPal (et gérer le retour),
    // - Soit créer un paiement Stripe, etc.

    console.log(`Paiement en cours via: ${paymentMethod}`);

    // 4.2 Générer la facture PDF
    const pdfPath = await generateInitialInvoice(user, subscriptionPrice);

    // 4.3 Envoyer l’email avec la facture PDF
    await sendWelcomeEmail(user.email, user.fullName, pdfPath);

    // 4.4 Mettre l'abonnement comme "actif" si besoin
    // (Ici, c'est un simple flag en mémoire, en DB ce serait une update)
    user.subscriptionActive = true;

    // 4.5 Rediriger vers la page de succès
    res.redirect('/auth/payment/success');
  } catch (error) {
    console.error('Erreur paiement:', error);
    res.redirect('/auth/payment/error');
  }
}

// 5. GET /auth/payment/success
function getPaymentSuccess(req, res) {
  res.render('paymentSuccess');
}

// 6. GET /auth/payment/error
function getPaymentError(req, res) {
  res.render('paymentError');
}


// -- Helpers

function getSubscriptionPrice(plan) {
  // Petit helper pour retourner un prix selon le plan
  switch (plan) {
    case 'pro':
      return 19.99;
    case 'premium':
      return 29.99;
    default:
      return 9.99; // plan "basic" par défaut
  }
}

module.exports = {
  getSignup,
  postSignup,
  getPayment,
  postPayment,
  getPaymentSuccess,
  getPaymentError
};
