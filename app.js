const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

// Слушаем 300 порт
const { PORT = 3000 } = process.env;

// создание инстанса сервера
const app = express();

// делаем запрос объектом json
app.use(express.json());

// соединение с БД
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// добавили в каждый запрос объект user
app.use((req, res, next) => {
  req.user = {
    _id: '6460f11c86e4c9f300ff3cc6',
  };
  next();
});

// подключаем роуты
app.use('/', router);

// запускаем сервер
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
