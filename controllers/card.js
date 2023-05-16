const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Ошибка при получении карточек' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка при создании карточки' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким ID не найдена' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка при удалении карточки' });
    });
};

// функция лайка

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка при постановке лайка' });
    });
};

// функция дизлайка

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Введены некорректные данные' });
        return;
      }
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка при постановке лайка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
