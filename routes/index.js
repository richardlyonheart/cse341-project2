const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/project2', require('./project2'));

router.use('/', require('./swagger'));

module.exports = router;