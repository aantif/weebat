require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mainRoutes = require('./routes/mainRoutes');
const authRoutes = require('./routes/authRoutes');
const pool = require('./config/db');
const findFreePort = require('find-free-port');
const path = require('path');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'changeThisSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Vérification de la connexion à PostgreSQL
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ message: 'Connexion réussie', time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de connexion à la base de données' });
  }
});

// Routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);

// Page d'accueil basique
app.get('/', (req, res) => {
  res.send('Accueil WeeBat (exemple)');
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Trouver un port libre et démarrer le serveur
findFreePort(3000, (err, freePort) => {
  if (err) {
    console.error('Erreur lors de la recherche d’un port libre :', err);
    process.exit(1);
  }
  app.listen(freePort, () => {
    console.log(`Serveur lancé sur http://localhost:${freePort}`);
  });
});
