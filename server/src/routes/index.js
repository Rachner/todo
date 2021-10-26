const express = require('express')
const router = express.Router()
const todo = require('./todo')
const word = require('./word')

router.use('/todos', todo)
router.use('/words', word) // /api/word 의 URL

module.exports = router