const userRouter = require('express').Router();

// импортируем контроллеры

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

userRouter.get('/', getUsers); // получение всех пользователей
userRouter.get('/:userId', getUserById); // получение пользователя по _id
userRouter.post('/', createUser); // создание пользователя
userRouter.patch('/me', updateProfile); // обновление данных профиля
userRouter.patch('/me/avatar', updateAvatar); // обновление автара

module.exports = userRouter;
