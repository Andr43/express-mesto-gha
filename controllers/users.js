const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  HTTP_STATUS_CREATED,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const StatusConflictError = require('../errors/status-conflict-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      if (!user) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Указанный Вами ID не прошел валидацию.'));
      }
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Такого пользователя не существует. Похоже, вы ввели непраивльный ID.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  function checkEmail() {
    if (isEmail(req.body.email) === false) {
      throw new BadRequestError('Указанный вами email не прошел валидацию.');
    }
    return req.body.email;
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
      if (!user) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.status(HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new StatusConflictError('Вы уже зарегистрированы.'));
      }
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      }
      next(err);
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
    .then((user) => {
      if (!user) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанный пользователь не найден.'));
      }
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      }
      next(err);
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
    .then((user) => {
      if (!user) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанный пользователь не найден.'));
      }
      if (err instanceof ValidationError) {
        next(new BadRequestError('Вы указали ссылку в неверном формате.'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
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
        next(new UnauthorizedError('Вы указали неверный email или пароль.'));
      }
      next(err);
    });
};
