const express = require('express');
const router = express.Router();

const housesController= require('../controllers/houses');

router.get('/', housesController.getAll);

router.get('/:id', housesController.getSingle);

router.post('/', housesController.createHouse);

router.put('/:id', housesController.updateHouse);

router.delete('/:id', housesController.deleteHouse);

module.exports = router;