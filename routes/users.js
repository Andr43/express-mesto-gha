const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateUserAvatar);

module.exports = userRouter;
