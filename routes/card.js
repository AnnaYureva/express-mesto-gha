const cardRouter = require('express').Router();

// импортируем контроллеры

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

// импортируем функции валидации

const {
  createCardValidation, cardIdValidation,
} = require('../middlewares/validator');

cardRouter.get('/', getCards); // получение всех карточек
cardRouter.post('/', createCardValidation, createCard); // создание новой карточки
cardRouter.delete('/:cardId', cardIdValidation, deleteCard); // удалить карточку по айди
cardRouter.put('/:cardId/likes', cardIdValidation, likeCard); // лайк карточки
cardRouter.delete('/:cardId/likes', cardIdValidation, dislikeCard); // дизлайк карточки

module.exports = cardRouter;
