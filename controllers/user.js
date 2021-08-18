const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET = 'super-strong-secret' } = process.env;

// Ошибки
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

// Запрос информации о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      // eslint-disable-next-line
      console.log(user);
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new NotFound('Пользователя с таким Id не существует');
      }
    })
    .catch(next);
};

// Обновить информацию о пользователе
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: true },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        throw new NotFound('Пользователь по указанному Id не найден');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(200)
      .send({
        email: user.email,
        name: user.name,
        _id: user._id,
      }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict('При регистрации указан email, который уже существует');
      } else if (err.name === 'CastError') {
        throw new BadRequest('Переданы некорректные данные при создании пользователя');
      }
    })
    .catch(next);
};

// Вход
module.exports.login = (req, res, next) => {
  // eslint-disable-next-line
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      throw new Unauthorized('Неверный логин либо пароль');
    })
    .catch(next);
};
