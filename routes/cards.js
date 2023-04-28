const cardRouter = require('express').Router();
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.post('/', createCard);

cardRouter.put('/:cardId/likes', putLike);

cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardRouter;
