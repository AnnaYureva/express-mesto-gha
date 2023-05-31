const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { loginValidation, createUserValidation } = require('./middlewares/validator');

// Слушаем 300 порт
const { PORT = 3000 } = process.env;

// создаем переменную с параметрами лимитера
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 1000, // лимит на 1000 запросов в минуту от одного айпи
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

// роуты для логина и регистрации

app.post('/signin', loginValidation, login); // валидация запроса происходит до его передачи контроллеру
app.post('/signup', createUserValidation, createUser);

app.use(auth); // авторизация
app.use('/', router);
app.use(errors()); // обработка ошибок
app.use(error);

// запускаем сервер
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
