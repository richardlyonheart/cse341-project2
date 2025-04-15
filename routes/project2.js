const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth');

const project2Controller= require('../controllers/project2');

router.get('/', isAuthenticated, project2Controller.getAll);

router.get('/:id', isAuthenticated, project2Controller.getSingle);

router.post('/', isAuthenticated, project2Controller.createCar);

router.put('/:id', isAuthenticated, project2Controller.updateCar);

router.delete('/:id',isAuthenticated, project2Controller.deleteCar);

module.exports = router;