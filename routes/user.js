const router = require('express').Router();

// Валидация Celebrate
const { userValidation } = require('../middlewares/validation');

// Контроллеры
const { getUserInfo, updateProfile } = require('../controllers/user');

router.get('/me', getUserInfo);
router.patch('/me', userValidation, updateProfile);

module.exports = router;
