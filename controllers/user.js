const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR, AUTH_ERROR, CONFLICT,
} = require('../utils/errors');

// получаем данные обо всех пользователях

const getUsers = (req, res, next) => {
  User.find({})
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Ошибка при получении данных пользователей' }))
    .then((users) => res.send(users))
    .catch(next);
};

// получаем данные о пользователе по айди

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Неверный запрос' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return next(err);
    });
};

// создаем пользователя

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(201).send({
        name, about, avatar, email, _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: 'Пользователь с таким email уже существует' });
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные пользователя' });
      }
      return next(err);
    });
};

// редактируем данные пользователя

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректные данные профиля' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return next(err);
    });
};

// редактируем фотографию пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return next(err);
    });
};

// создаем контроллер логин
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(AUTH_ERROR).send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return res.status(AUTH_ERROR).send({ message: 'Неправильные почта или пароль' });
      }
      const token = jwt.sign({ _id: User._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

// контроллер для получения информации о пользователе

const getCurrentUser = (req, res, next) => {
  const { userId } = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный ID' });
      }
      if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с таким ID не найден' });
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
