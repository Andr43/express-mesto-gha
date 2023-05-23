const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const StatusConflictError = require('../errors/status-conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Указанный Вами ID не прошел валидацию.'));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Такого пользователя не существует. Похоже, вы ввели непраивльный ID.'));
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new StatusConflictError('Вы уже зарегистрированы.'));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      } else next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанный пользователь не найден.'));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      } else next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанный пользователь не найден.'));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError('Вы указали ссылку в неверном формате.'));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ data: user })
        .end();
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Вы указали неверный email или пароль.'));
      } else next(err);
    });
};
