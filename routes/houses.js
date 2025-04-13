const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth');

const housesController= require('../controllers/houses');

router.get('/', isAuthenticated, housesController.getAll);

router.get('/:id', isAuthenticated, housesController.getSingle);

router.post('/', isAuthenticated, housesController.createHouse);

router.put('/:id', isAuthenticated, housesController.updateHouse);

router.delete('/:id', isAuthenticated, housesController.deleteHouse);

module.exports = router;