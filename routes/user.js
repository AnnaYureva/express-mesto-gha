const userRouter = require('express').Router();

// импортируем контроллеры

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/user');

// импортируем функции валидации

const {
  updateUserValidation, updateAvatarValidation, userIdValidation,
} = require('../middlewares/validator');

userRouter.get('/', getUsers); // получение всех пользователей
userRouter.get('/me', getCurrentUser); // получение информации о пользователе
userRouter.get('/:userId', userIdValidation, getUserById); // получение пользователя по _id
userRouter.patch('/me', updateUserValidation, updateProfile); // обновление данных профиля
userRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar); // обновление автара

module.exports = userRouter;
