// eslint-disable-next-line import/no-extraneous-dependencies
const userRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUserById);

userRouter.post('/', createUser);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
