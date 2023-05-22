const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), deleteCard);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(w{1,3}\.)?[\w+\-._~:/?#[\]@!$&'()*+,;=]+/),
  }),
}), createCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), putLike);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), deleteLike);

module.exports = cardRouter;
