const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(w{1,3}\.)?[\w+\-._~:/?#[\]@!$&'()*+,;=]+/),
  }),
}), updateUserAvatar);

module.exports = userRouter;
