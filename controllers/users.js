const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
} = require('../utils/constants');

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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
