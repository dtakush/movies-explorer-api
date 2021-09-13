const token = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET = 'super-strong-secret' } = process.env;

// Ошибки
const errorMessages = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

// Запрос информации о пользователе
module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new NotFound(errorMessages.noUserId);
      } else {
        throw err;
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
        throw new NotFound(errorMessages.noUserId);
      } else if (err.name === 'CastError') {
        throw new BadRequest(errorMessages.incorrectUserInfo);
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict(errorMessages.existingEmail);
      } else {
        throw err;
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
        throw new Conflict(errorMessages.existingEmail);
      } else if (err.name === 'CastError') {
        throw new BadRequest(errorMessages.incorrectUserInfo);
      } else {
        throw err;
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
      const jwt = token.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      return res.send({ jwt });
    })
    .catch(() => {
      throw new Unauthorized('Неверный логин либо пароль');
    })
    .catch(next);
};

// Выход из аккаунта
// eslint-disable-next-line
module.exports.signout = (req, res) => {
  res.clearCookie('jwt', { httpOnly: true });
  res.status(200).json({ message: 'OK' });
};
