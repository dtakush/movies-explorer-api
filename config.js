const {
  PORT = 3000,
  JWT_SECRET = 'super-strong-secret',
} = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
};
