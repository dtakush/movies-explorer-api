const Movie = require('../models/movie');

// Ошибки
const errorMessage = require('../utils/constants');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

// Запрос всех фильмов пользователя
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(errorMessage.incorrectFilmInfo);
      } else {
        throw err;
      }
    })
    .catch(next);
};

// Создание фильма
module.exports.postMovie = (req, res, next) => {
  // console.log(req.user);
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(errorMessage.incorrectFilmInfo);
      } else {
        throw err;
      }
    })
    .catch(next);
};

// Удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        movie.remove()
          .then(() => {
            res.send({ message: 'Фильм удален' });
          })
          .catch((err) => next(err));
      } else {
        throw new Forbidden(errorMessage.noRightsToDelete);
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFound(errorMessage.incorrectFilmId);
      } else if (err.name === 'CastError') {
        throw new BadRequest(errorMessage.incorrectFilmInfo);
      } else {
        throw err;
      }
    })
    .catch(next);
};
