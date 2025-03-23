const express = require('express');
const router = express.Router();

const project2Controller= require('../controllers/project2');

router.get('/', project2Controller.getAll);

router.get('/:id', project2Controller.getSingle);

router.post('/', project2Controller.createCar);

router.put('/:id', project2Controller.updateCar);

router.delete('/:id', project2Controller.deleteCar);

module.exports = router;