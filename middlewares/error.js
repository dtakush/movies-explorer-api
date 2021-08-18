module.exports = (err, req, res, next) => {
  if (!err.statusCode) {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'Что-то пошло не так'
          : message,
      });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  return next();
};
