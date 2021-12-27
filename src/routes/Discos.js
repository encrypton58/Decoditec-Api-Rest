const express = require('express')
const mysqlConn = require('../database.js')
const router = express.Router();
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')

const route = "/api/discos"

const table = "discos"


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
        let id = req.params.id_registro
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
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
        const id = req.params.id_registro
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
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
    let id_registro = req.params.id_registro

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            let disco = {}

            if (req.body.disco) {
                disco.disco = req.body.disco
            }
            if (req.body.proyecto) {
                disco.proyecto = req.body.proyecto
            }
            if (req.body.registro_user) {
                disco.registro_user = req.body.registro_user
            }
            if (req.body.fecha) {
                disco.fecha = req.body.fecha
            }


            mysqlConn.query("UPDATE " + table + " SET ? WHERE id_registro = ? ", [disco, id_registro], (err, rows, fields) => {
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

            let disco = {
                id_trabajador: req.body.id_trabajador,
                proyecto: req.body.proyecto,
                disco: req.body.disco,
                registro_user: req.body.registro_user,
                fecha: currentDay
            }

            mysqlConn.query('INSERT INTO ' + table + ' SET ?', [disco], (err, rows, fields) => {
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