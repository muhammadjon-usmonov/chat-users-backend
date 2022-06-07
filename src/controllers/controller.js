const sha256 = require('sha256')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
const { readFile, writeFile } = require('../utils/utils.js')
const { AuthorizationError } = require('../utils/errors.js')
const { fstat } = require('fs')


const secretKey = 'secret'

const Register = (req, res) => {
    let body = req.body
    let file = req.files
    let users = readFile('users')


    if(file){
        let fileName = Date.now() + file.img.name.replace(/\s/g, "")
        file.img.mv(path.join(__dirname, '../', 'uploads', 'avatars', fileName))
        body.avatar = `http://localhost:3000/ava/${fileName}`
    } else {
        body.avatar = "http://localhost:3000/ava/simple.jpg"
    }
    
    body.userId = users.length ? +users.at(-1).userId + 1 : 1
    body.password = sha256(body.password)

    users.push(body)
    writeFile('users', users)

    delete body.password

    res.status(201).send({
        status : 201,
        message: 'successful registered',
        token : jwt.sign({
            userId : body.userId,
            devise : req.headers['user-agent'],
            ip : req.ip
        }, secretKey),
        user : body
    })

}



const Login = (req, res, next) => {

    try {

        let body = req.body
        let users = readFile('users')

        let user = users.find(user => user.username == body.username && user.password == sha256(body.password))

        if(!user) throw new AuthorizationError(401, 'wrong username or password')


        delete user.password

        res.status(200).send({
            status : 200,
            message : 'successful logined',
            token : jwt.sign({
                userId : user.userId,
                devise : req.headers['user-agent'],
                ip: req.ip
            }, secretKey),
            user : user
        })
        
    } catch (error) {
        next(error)
    }

}




const GetUsers = (req, res) => {
    let users = readFile('users')
    res.status(200).send(users.filter(user => delete user.password))
}




const PostMessage = (req, res) => {
    let body = req.body
    let file = req.files
    let date = new Date()
    let messages = readFile("messages")

    if(file){
        let fileName = Date.now() + file.file.name.replace(/\s/g, "")
        file.file.mv(path.join(__dirname, "../", 'uploads', 'files', fileName))
        body.file = {
            view : `http://localhost:3000/view/${fileName}`,
            download : `http://localhost:3000/download/${fileName}`
        }
        body.type = 'file'
        body.type.name = file.file.name
    } else {
        delete body.file
        body.type = "text"
    }


    body.date = date.toLocaleDateString()
    body.time = `${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`
    body.messageId = messages.length ? +messages.at(-1).messageId + 1 : 1

    messages.push(body)
    writeFile('messages', messages)

    res.status(201).send({
        status: 201,
        message : "message is added",
        data: body
    })
}




const GetMessages = (req, res) => {
    let messages = readFile('messages')
    res.status(200).send(messages)
}


const GetFile = (req, res) => {
    let {fileName} = req.params
    res.sendFile(path.join(__dirname, '../', 'uploads', 'files', fileName))
}

const DownloadFile = (req, res) => {
    let {fileName} = req.params
    res.download(path.join(__dirname, '../', 'uploads', 'files', fileName))
}

const GetAva = (req, res) => {
    let {fileName} = req.params
    res.sendFile(path.join(__dirname, '../', 'uploads', 'avatars', fileName))
}


module.exports = {
    Register,
    Login,
    GetUsers,
    PostMessage,
    GetMessages,
    GetFile,
    DownloadFile,
    GetAva
}