const express = require('express')
const { GetFile, DownloadFile, GetAva } = require('../controllers/controller')

let router = express.Router()


router.get('/view/:fileName', GetFile)
router.get('/download/:fileName', DownloadFile)
router.get('/ava/:fileName', GetAva)

module.exports =  router