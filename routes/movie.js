const router = require('express').Router();

// Валидация Celebrate
const { movieValidation, movieIdValidation } = require('../middlewares/validation');

// Контроллеры
const { getMovies, postMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', movieValidation, postMovie);
router.delete('/', movieIdValidation, deleteMovie);

module.exports = router;
