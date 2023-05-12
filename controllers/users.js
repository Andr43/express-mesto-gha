const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  HTTP_STATUS_CREATED,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Указанный Вами ID не прошел валидацию.' });
        return;
      }
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такого пользователя не существует. Похоже, вы ввели непраивльный ID.' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.createUser = (req, res) => {
  function checkEmail() {
    if (isEmail(req.body.email) === true) {
      return req.body.email;
    }
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: checkEmail(),
      password: hash,
    }))
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданные данные некорректны.' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Указанный пользователь не найден.' });
      }
      if (err instanceof ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданные данные некорректны.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Указанный пользователь не найден.' });
      }
      if (err instanceof ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданные данные некорректны.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Вы указали неверный email или пароль.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.getUserInfo = (req, res) => {
  User.find(req.params)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Указанный Вами ID не прошел валидацию.' });
        return;
      }
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такого пользователя не существует. Похоже, вы ввели непраивльный ID.' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};
