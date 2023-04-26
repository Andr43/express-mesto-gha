// eslint-disable-next-line import/newline-after-import
const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: 'Переданные данные некорректны' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
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
      upsert: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ message: 'Указанный пользователь не найден' });
      }
      if (err instanceof ValidationError) {
        return res.status(400).send({ message: 'Переданные данные некорректны' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
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
      upsert: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ message: 'Указанный пользователь не найден' });
      }
      if (err instanceof ValidationError) {
        return res.status(400).send({ message: 'Переданные данные некорректны' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
