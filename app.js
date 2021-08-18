require('dotenv').config();
const express = require('express');

const app = express();

const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const cors = require('cors');

const { PORT = 3000 } = process.env;

// Импорт контроллеров
const { login, createUser } = require('./controllers/user');

// Импорт мидлвар
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { loginValidation, signupValidation } = require('./middlewares/validation');
const midlewareErrors = require('./middlewares/error');
const auth = require('./middlewares/auth');

// Импорт роутов
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');

/* const corsOptions = {
  origin: 'https://dtakush.mesto.students.nomoredomains.club',
  credentials: true,
}; */

app.use(helmet());
// app.use(cors(corsOptions));
app.disable('x-powered-by');
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// подключаем логгер запросов
app.use(requestLogger);

// Роуты
app.post('/signup', signupValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth);

app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // ошибки celebrate
app.use(midlewareErrors); // централизованная обработка ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Порт 3000`);
});
