const express = require('express')
const mysqlConn = require('../database.js')
const router = express.Router()
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')

const route = "/api/prestamos"

const table = "prestamos"


router.get(route + "/getAll", verifyToken, (req, res) => {
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
                mysqlConn.query("SELECT * FROM " + table, (err, rows, fields) => {
                    if (!err) {
                        if (rows.length > 0) {
                            res.json(rows)
                        } else {
                            res.json({ registros: "empty" })
                        }
                    } else {
                        console.log(err)
                    }
                });
            }
        })
    })
    //eliminar registro
router.delete(route + '/delete/:id_registro', verifyToken, (req, res) => {
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
                let id = req.params.id_registro
                mysqlConn.query("DELETE FROM " + table + " WHERE id_registro = ?", [id], (err, rows, fields) => {
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
    //obtener unico registro
router.get(route + "/get/:id_registro", verifyToken, (req, res) => {
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
                const id = req.params.id_registro
                mysqlConn.query("SELECT * FROM " + table + " WHERE id_registro = ?", [id], (err, rows, fields) => {
                    if (!err) {
                        if (rows.length > 0) {
                            res.json(rows[0])
                        } else {
                            res.json({ error: "noFound" })
                        }
                    } else {
                        console.log(err)
                    }
                })

            }
        })
    })
    //Buscar registro con texto
router.get(route + "/search", verifyToken, (req, res) => {
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
                mysqlConn.query("SELECT * FROM " + table + " WHERE " + req.query.filtro + " LIKE '%" + req.query.search + "%'", (err, rows, fields) => {
                    if (!err) {
                        if (rows.length > 0) {
                            res.json(rows)
                        } else {
                            res.json({ error: "noFound" })
                        }
                    } else {
                        console.log(err)
                    }
                })
            }
        })
    })
    //editar registro
router.put(route + "/edit/:id_registro", verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            let id_registro = req.params.id_registro

            let prestamo = {}

            if (req.body.id_herramienta) {
                prestamo.id_herramienta = req.body.id_herramienta
            }

            if (req.body.registro_user) {
                prestamo.registro_user = req.body.registro_user
            }
            if (req.body.fecha) {
                prestamo.fecha = req.body.fecha
            }


            mysqlConn.query("UPDATE " + table + " SET ? WHERE id_registro = ? ", [prestamo, id_registro], (err, rows, fields) => {
                if (!err) {
                    if (rows.affectedRows > 0) {
                        res.json({ editado: true })
                    } else {
                        res.json({ editado: false })
                    }
                } else {
                    console.log(err);
                }

            })

        }
    })

})

//registrar registro
router.post(route + '/register', verifyToken, (req, res) => {
    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {
            let date = new Date();

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            let currentDay = (month < 10) ? `${day}-0${month}-${year}` : `${day}-${month}-${year}`

            let prestamo = {
                id_trabajador: req.body.id_trabajador,
                id_herramienta: req.body.id_herramienta,
                registro_user: req.body.registro_user,
                fecha: currentDay
            }

            mysqlConn.query('INSERT INTO ' + table + ' SET ?', [prestamo], (err, rows, fields) => {
                if (!err) {
                    if (rows.affectedRows > 0) {
                        res.json({ registrado: true })
                    } else {
                        res.json({ registrado: false })
                    }
                } else {
                    console.log(err)
                }
            })
        }
    })
})

module.exports = router;