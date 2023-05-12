const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUserById);

userRouter.patch('/me', updateUser);

userRouter.patch('/me/avatar', updateUserAvatar);

userRouter.get('/me', getUserInfo);

module.exports = userRouter;
