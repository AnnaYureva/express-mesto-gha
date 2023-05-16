const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes/index');

// Слушаем 300 порт
const { PORT = 3000 } = process.env;

// создаем переменную с параметрами лимитера
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 50, // лимит на 10 запросов в минуту от одного айпи
  standardHeaders: true, // вернуть информцию об ограничениях в заголовки `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*`
});

// создание инстанса сервера
const app = express();

app.use(helmet());

// применяем миллдвэр ко всем запросам
app.use(limiter);

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
