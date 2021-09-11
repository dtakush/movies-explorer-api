const router = require('express').Router();
const cors = require('cors');

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

const corsOptions = {
  origin: 'https://dtakush.diploma.nomoredomains.monster',
  credentials: true,
  optionsSuccessStatus: 204,
};
router.use(cors(corsOptions));

// Роуты
router.post('/signup', signupValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.post('/signout', signout);
router.use(userRouter);
router.use(movieRouter);

router.use(() => {
  throw new NotFound(errorMessage.noUrl);
});

module.exports = router;
