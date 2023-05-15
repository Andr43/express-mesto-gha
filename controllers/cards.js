const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const {
  HTTP_STATUS_CREATED,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const InternalServerError = require('../errors/internal-server-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!cards) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      if (req.user._id !== card.owner.toHexString()) {
        throw new UnauthorizedError('Вы не имеете достаточных прав, чтобы удалить данную карточку.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Такой карточки не существует.'));
      }
      if (err instanceof CastError) {
        next(new BadRequestError('Запрашиваемая карточка не найдена.'));
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      if (!card) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.status(HTTP_STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      }
      next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!cards) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанная карточка не найдена.'));
      }
      if (err instanceof CastError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      }
      next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((cards) => {
      if (!cards) {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанная карточка не найдена.'));
      }
      if (err instanceof CastError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      }
      next(err);
    });
};
