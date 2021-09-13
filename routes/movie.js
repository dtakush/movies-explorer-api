const router = require('express').Router();
const cors = require('cors');

// Валидация Celebrate
const { movieValidation, movieIdValidation } = require('../middlewares/validation');

// Контроллеры
const { getMovies, postMovie, deleteMovie } = require('../controllers/movie');

const corsOptions = {
  origin: [
    'http://localhost:3000/movies',
    'https://dtakush.diploma.nomoredomains.monster/movies',
    'http://dtakush.diploma.nomoredomains.monster/movies',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

router.get('/movies', cors(corsOptions), getMovies);
router.post('/movies', cors(corsOptions), movieValidation, postMovie);
router.delete('/movies/:movieId', cors(corsOptions), movieIdValidation, deleteMovie);

module.exports = router;
