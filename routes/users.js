const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

const {
  getUserByIdValidator,
  updateUserValidator,
  updateUserAvatarValidator,
} = require('../validators/validator');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:userId', getUserByIdValidator, getUserById);

userRouter.patch('/me', updateUserValidator, updateUser);

userRouter.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

module.exports = userRouter;
