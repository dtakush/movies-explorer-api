const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { CURRENT_PORT, CURRENT_DB } = require('./utils/envConstants');

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
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(cors(corsOptions));
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json());

mongoose.connect(CURRENT_DB, {
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

app.listen(CURRENT_PORT, () => {
  console.log(CURRENT_PORT);
});
