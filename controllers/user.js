const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require('../utils');

// получаем данные обо всех пользователях

const getUsers = (req, res) => {
  User.find({})
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Ошибка при получении данных пользователей' }))
    .then((users) => res.send(users));
};

// получаем данные о пользователе по айди

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Неверный запрос' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка при получении данных о пользователе' });
    });
};

// создаем пользователя

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка при создании пользователя' });
    });
};

// редактируем данные пользователя

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные профиля' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка при обновлении данных пользователя' });
    });
};

// редактируем фотографию пользователя
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка при обновлении аватара' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
