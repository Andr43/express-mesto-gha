// eslint-disable-next-line import/no-extraneous-dependencies
const cardRouter = require('express').Router();
const { getCards, deleteCard, createCard, putLike, deleteLike } = require('../controllers/cards');

cardRouter.get('/cards', getCards);

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.post('/cards', createCard);

cardRouter.put('/cards/:cardId/likes', putLike);

cardRouter.delete('/cards/:cardId/likes', deleteLike);

module.exports = cardRouter;
