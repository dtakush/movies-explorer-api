const {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  MONGO_URL,
} = process.env;

const CURRENT_JWT_SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'super-strong-secret';
const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : 4000;
const CURRENT_DB = NODE_ENV === 'production' && MONGO_URL ? MONGO_URL : 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  CURRENT_JWT_SECRET,
  CURRENT_PORT,
  CURRENT_DB,
};
