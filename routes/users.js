const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', getUserById);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
