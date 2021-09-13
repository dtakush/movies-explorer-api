const router = require('express').Router();

// Валидация Celebrate
const { movieValidation, movieIdValidation } = require('../middlewares/validation');

// Контроллеры
const { getMovies, postMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', getMovies);
router.post('/movies', movieValidation, postMovie);
router.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
