const jwt = require('jsonwebtoken');
const {
  HTTP_STATUS_UNAUTHORIZED,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
