const express = require('express')
const validation = require('../middleware/validation.js')
const { Register, Login, GetUsers } = require('../controllers/controller.js')
const checkToken = require('../middleware/checkToken.js')

let router = express.Router()

router.post('/register', validation, Register)
router.post('/login', validation, Login)
router.get('/users', checkToken, GetUsers)


module.exports = router