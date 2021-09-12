require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('./middlewares/cors');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const app = express();

// Импорт ошибок
const errorMessage = require('./utils/constants');
const NotFound = require('./errors/NotFound');

// Импорт контроллеров
const { login, createUser, signout } = require('./controllers/user');

// Импорт мидлвар
const { loginValidation, signupValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');

// Импорт роутов
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');

// Импорт мидлвар
const { requestLogger, errorLogger } = require('./middlewares/logger');
const midlewareErrors = require('./middlewares/error');

const limiter = require('./utils/rateLimiter');

const corsOptions = {
  origin: [
    'http://localhost:3001',
    'https://dtakush.diploma.nomoredomains.monster',
    'http://dtakush.diploma.nomoredomains.monster',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

// app.use(cors);
app.use(helmet());
app.use('*', cors(corsOptions));
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
app.post('/signup', cors(corsOptions), signupValidation, createUser);
app.post('/signin', cors(corsOptions), loginValidation, login);

app.use(auth);

app.post('/signout', signout);
app.use(userRouter);
app.use(movieRouter);

app.use(() => {
  throw new NotFound(errorMessage.noUrl);
});

// логгер ошибок
app.use(errorLogger);
// ошибки celebrate
app.use(errors());
// централизованная обработка ошибок
app.use(midlewareErrors);

app.listen(PORT, () => {
  console.log(PORT);
});
