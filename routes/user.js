const router = require('express').Router();

// Валидация Celebrate
const { userValidation } = require('../middlewares/validation');

// Контроллеры
const { getUserInfo, updateProfile } = require('../controllers/user');

router.get('/users/me', getUserInfo);
router.patch('/users/me', userValidation, updateProfile);

module.exports = router;
