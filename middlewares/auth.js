const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'super-strong-secret' } = process.env;

// eslint-disable-next-line
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload;
  next();
};

/* const jwt = require('jsonwebtoken');

// Импорт ошибок
const errorMessage = require('../utils/constants');
const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'super-strong-secret' } = process.env;

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token) {
    throw new Unauthorized(errorMessage.unauthorized);
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized(`${errorMessage.unauthorized} из-за ${err.message}`);
  }
  req.user = payload;
  next();
}; */
