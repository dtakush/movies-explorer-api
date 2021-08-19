const jwt = require('jsonwebtoken');

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
};
