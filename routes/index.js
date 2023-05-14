const router = require('express').Router();
const userRouter = require('./user');
const cardRouter = require('./card');

router.use('/users', userRouter);
router.use('/cards', cardRouter);

module.exports = router;
