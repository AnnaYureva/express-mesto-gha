const cardRouter = require('express').Router();

// импортируем контроллеры

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

cardRouter.get('/', getCards); // получение всех карточек
cardRouter.post('/', createCard); // создание новой карточки
cardRouter.delete('/:cardId', deleteCard); // удалить карточку по айди
cardRouter.put('/:cardId/likes', likeCard); // лайк карточки
cardRouter.delete('/:cardId/likes', dislikeCard); // дизлайк карточки

module.exports = cardRouter;
