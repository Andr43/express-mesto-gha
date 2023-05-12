const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');
const {
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_UNAUTHORIZED,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => { res.send({ data: cards }); })
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      if (req.user._id !== card.owner.toHexString()) {
        res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Вы не имеете достаточных прав, чтобы удалить данную карточку' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такой карточки не существует. Похоже, вы ввели непраивльный ID.' });
        return;
      }
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Запрашиваемая карточка не найдена.' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданные данные некорректны.' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((cards) => { res.send({ data: cards }); })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Указанная карточка не найдена.' });
        return;
      }
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданные данные некорректны.' });
        return;
      }
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((cards) => { res.send({ data: cards }); })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Указанная карточка не найдена.' });
      }
      if (err instanceof CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданные данные некорректны.' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка.' });
    });
};
