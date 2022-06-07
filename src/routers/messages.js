const express = require('express')
const checkToken = require('../middleware/checkToken.js')
const validation = require('../middleware/validation.js')
const { PostMessage, GetMessages } = require('../controllers/controller')



let router = express.Router()

router.post('/message', checkToken, validation, PostMessage)
router.get('/messages', checkToken, GetMessages)


module.exports = router