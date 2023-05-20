const cardRouter = require('express').Router();
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);

cardRouter.put('/:cardId/likes', putLike);

cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardRouter;
