require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const app = express();

// Импорт роутов
const routes = require('./routes/index');

// Импорт мидлвар
const { requestLogger, errorLogger } = require('./middlewares/logger');
const midlewareErrors = require('./middlewares/error');

const limiter = require('./utils/rateLimiter');

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json());

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// логгер запросов
app.use(requestLogger);

// rate limiter
app.use(limiter);

// Роуты
app.use(routes);

// логгер ошибок
app.use(errorLogger);
// ошибки celebrate
app.use(errors());
// централизованная обработка ошибок
app.use(midlewareErrors);

app.listen(PORT, () => {
  console.log(PORT);
});
