const jwt = require('jsonwebtoken');

// Импорт ошибок
const errorMessage = require('../utils/constants');
const Unauthorized = require('../errors/Unauthorized');

const { CURRENT_JWT_SECRET } = require('../utils/envConstants');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token) {
    throw new Unauthorized(errorMessage.unauthorized);
  }

  let payload;
  try {
    payload = jwt.verify(token, CURRENT_JWT_SECRET);
  } catch (err) {
    throw new Unauthorized(`${errorMessage.unauthorized} из-за ${err.message}`);
  }
  req.user = payload;
  next();
};
