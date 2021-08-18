require('dotenv').config();

const Movie = require('../models/movie');

// Ошибки
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

// Запрос всех фильмов пользователя
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при запросе фильмов');
      }
    })
    .catch(next);
};

// Создание фильма
module.exports.postMovie = (req, res, next) => {
  const id = req.user._id;
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
    owner: id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при создании фильма');
      }
    })
    .catch(next);
};

// Удаление фильма
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotValidId'))
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => res.send(movie))
          .catch(next);
      } else {
        throw new Forbidden('У вас нет прав на удаление этого фильма');
      }
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFound('Фильм с указанным Id не найдена');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные');
      }
    })
    .catch(next);
};
