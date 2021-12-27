const express = require('express')
const mysqlConn = require('../database')
const router = express.Router()
const by = require('bcryptjs')
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')


router.post('/api/login/register', (req, res) => {

    by.hash(req.body.pass, 10).then((hash) => {

        let user = {
            id: 0,
            nombre: req.body.nombre,
            correo: req.body.correo,
            pass: hash
        }

        mysqlConn.query("INSERT INTO users SET ?", [user], (err, rows, fields) => {
            if (!err) {
                if (rows.affectedRows > 0) {
                    res.json({ registrado: true })
                } else {
                    res.json({ registrado: false })
                }
            } else {
                res.sendStatus(500);
            }
        })

    })

})

router.post('/api/login/signup', verifyToken, (req, res) => {

    console.log(req.body);

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            mysqlConn.query("SELECT * FROM users WHERE correo = ?", [req.body.correo], (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0) {
                        if (by.compareSync(req.body.pass, rows[0].pass)) {
                            let user = {
                                id: rows[0].id,
                                nombre: rows[0].nombre,
                                correo: rows[0].correo,
                                error: ""
                            }
                            res.json(user);
                        } else {
                            res.json({ error: "password" })
                        }
                    } else {
                        res.json({ error: "noFound" })
                    }


                } else {
                    console.log(err);
                }
            })

        }
    })
})

router.delete('/api/login/delete/:id', verifyToken, (req, res) => {
    let id = req.params.id
    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
            mysqlConn.query("DELETE FROM users WHERE id = ?", [id], (err, rows, fields) => {
                if (!err) {
                    if (rows.affectedRows > 0) {
                        res.json({ delete: true })
                    } else {
                        res.json({ delete: false })
                    }

                } else {
                    console.log(err);
                }
            })
        }
    })

})

router.get('/api/login/getAll', verifyToken, (req, res) => {
    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo",
                codeError: err
            })
        } else {
            mysqlConn.query("SELECT id, nombre, correo FROM users", (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0) {
                        res.json(rows)
                    } else {
                        res.json({ registros: "empty" })
                    }
                } else {
                    res.sendStatus(500)
                }
            });
        }
    })
})

module.exports.router = router;