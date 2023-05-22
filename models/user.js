const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const UnauthorizedError = require('../errors/unauthorized-error');
const { regex } = require('../utils/constants');

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
        validator(v) {
          return regex.test(v);
        },
        message: (props) => `${props.value} не является ссылкой!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return isEmail(v);
        },
        message: (props) => `${props.value} не соответствует формату email!`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true }, versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Необходима авторизация.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Необходима авторизация.'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
