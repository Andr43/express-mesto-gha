require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { centralErrorHandler } = require('./errors/handlers/central-error-handler');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsHandler = require('./middlewares/corsHandler');
const {
  registrationValidator,
  loginValidator,
} = require('./validators/validator');

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(cookieParser());
app.use(corsHandler);
app.use(requestLogger);
app.post('/signup', registrationValidator, createUser);
app.post('/signin', loginValidator, login);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
