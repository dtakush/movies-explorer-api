const router = require('express').Router();
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://dtakush.diploma.nomoredomains.monster',
    'http://dtakush.diploma.nomoredomains.monster',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

// Импорт ошибок
const errorMessage = require('../utils/constants');
const NotFound = require('../errors/NotFound');

// Импорт контроллеров
const { login, createUser, signout } = require('../controllers/user');

// Импорт мидлвар
const { loginValidation, signupValidation } = require('../middlewares/validation');
const auth = require('../middlewares/auth');

// Импорт роутов
const userRouter = require('./user');
const movieRouter = require('./movie');

// Роуты
router.post('/signup', cors(corsOptions), signupValidation, createUser);
router.post('/signin', cors(corsOptions), loginValidation, login);

router.use(auth);

router.post('/signout', cors(corsOptions), signout);
router.use(userRouter);
router.use(movieRouter);

router.use(() => {
  throw new NotFound(errorMessage.noUrl);
});

module.exports = router;
