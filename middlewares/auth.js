const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/Unauthorized');

const { JWT_SECRET = 'super-strong-secret' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Небходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized('Небходима авторизация');
  }

  req.user = payload;

  next();
};
