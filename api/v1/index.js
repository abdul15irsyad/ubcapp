var express = require('express');
var router = express.Router();

const player = require('./player')
const team = require('./team')

router.use('/player', player);
router.use('/team', team);

module.exports = router;