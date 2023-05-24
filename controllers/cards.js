const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const {
  HTTP_STATUS_CREATED,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const StatusForbiddenError = require('../errors/status-forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      } else next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id !== card.owner.toHexString()) {
        throw new StatusForbiddenError('Вы не имеете достаточных прав, чтобы удалить данную карточку.');
      } else {
        return Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.send({ message: 'Ваша карточка удалена.' });
          });
      }
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Такой карточки не существует.'));
      } else if (err instanceof CastError) {
        next(new BadRequestError('Запрашиваемая карточка не найдена.'));
      } else next(err);
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
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанная карточка не найдена.'));
      } else if (err instanceof CastError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      } else next(err);
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
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('Указанная карточка не найдена.'));
      } else if (err instanceof CastError) {
        next(new BadRequestError('Переданные данные некорректны.'));
      } else next(err);
    });
};
