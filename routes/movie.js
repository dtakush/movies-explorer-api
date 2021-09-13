const router = require('express').Router();

// Валидация Celebrate
const { movieIdValidation } = require('../middlewares/validation');

// Контроллеры
const { getMovies, deleteMovie } = require('../controllers/movie');

router.get('/movies', getMovies);
router.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
