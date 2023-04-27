// eslint-disable-next-line import/no-extraneous-dependencies
const mainRouter = require('express').Router();

mainRouter.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый URL не существует' });
});

module.exports = mainRouter;
