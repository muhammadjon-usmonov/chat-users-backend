`const express = require('express')
const userRouter = require('./routers/users.js')
const messageRouter = require('./routers/messages.js')
const fileRouter = require('./routers/files')
const fileUpload = require('express-fileupload')

let app = express()

app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(fileUpload())

app.use(userRouter)
app.use(messageRouter)
app.use(fileRouter)






app.use((err, req, res, next) => {
    if(err.status >= 400 && err.status < 500){
       return res.status(err.status).send({
            status : err.status,
            message: err.message
        })
    }  

    res.status(500).send({
        status: 500,
        message: err.message
    })
})



const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is runing on ${PORT} port`))