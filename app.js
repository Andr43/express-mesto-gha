require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const router = require('./routes/index');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
