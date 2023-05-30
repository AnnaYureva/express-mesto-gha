const jwt = require('jsonwebtoken');
const { AUTH_ERROR } = require('../utils/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(AUTH_ERROR).send({ message: 'Неправильные почта или пароль' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(AUTH_ERROR).send({ message: 'Неправильные почта или пароль' });
  }
  req.user = payload;
  return next();
};
