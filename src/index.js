const express = require('express')
const path = require('path')
const jwt = require('jsonwebtoken')
const app = express()

//settings
app.set('port', 8100)
    //app.set('ip', 'fd00::3:a632')
    //Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(require('./routes/Trabajadores.js'))
let login = require('./routes/Login.js')
app.use(login.router)
app.use(require('./routes/Mascarillas.js'))
app.use(require('./routes/SalidasDeAlmacen.js'))
app.use(require('./routes/ValesSalidas.js'))
app.use(require('./routes/Herramientas.js'))
app.use(require('./routes/Discos.js'))
app.use(require('./routes/Guantes.js'))
app.use(require('./routes/Gafas.js'))
app.use(require('./routes/Prestamos.js'))
app.use(require('./routes/LoginAPI.js'))
const verifyToken = require('./CheckToken.js')

app.get('/', verifyToken, (res, req) => {
    jwt.verify(res.token, "Marc", (err, authData) => {
        if (err) {
            console.log(err)
            req.sendStatus(403)
            console.log("break here 2.0")
        } else {
            req.sendFile(path.join(__dirname + '/inputs.html'));
        }
    })
})

//Server Running
app.listen(app.get('port'), app.get('ip'), () => {
    console.log("server listen " + app.get('port'))
});