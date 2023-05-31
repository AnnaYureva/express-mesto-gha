const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (link) => validator.isURL(link),
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;

                return Promise.reject(new AuthError('Неправильная почта или пароль'));
              });
            }

            return Promise.reject(new AuthError('Неправильная почта или пароль'));
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
