const cardRouter = require('express').Router();
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/cards');
const {
  cardIdValidator,
  createCardValidator,
} = require('../validators/validator');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', cardIdValidator, deleteCard);

cardRouter.post('/', createCardValidator, createCard);

cardRouter.put('/:cardId/likes', cardIdValidator, putLike);

cardRouter.delete('/:cardId/likes', cardIdValidator, deleteLike);

module.exports = cardRouter;
