// eslint-disable-next-line import/newline-after-import
const { DocumentNotFoundError, CastError, ValidationError } = require('mongoose').Error;
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => { res.send({ data: cards }); })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => { res.send({ data: card }); })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: 'Переданные данные некорректны' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => { res.send({ data: cards }); })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ message: 'Указанная карточка не найдена' });
      }
      if (err instanceof CastError) {
        return res.status(400).send({ message: 'Переданные данные некорректны' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => { res.send({ data: cards }); })
  // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        return res.status(404).send({ message: 'Указанная карточка не найдена' });
      }
      if (err instanceof CastError) {
        return res.status(400).send({ message: 'Переданные данные некорректны' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
