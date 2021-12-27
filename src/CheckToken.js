module.exports = verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    } else {
        res.json({ mensaje: "No se ha dectectado el token prueba a iniciar sesion" })
        console.log("break here")
    }
}