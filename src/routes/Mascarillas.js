const express = require('express');
const mysqlConn = require('../database');
const router = express.Router();
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')

const route = '/api/mascarillas'

//obtener todo
router.get(route + "/getAll", verifyToken, (req, res) => {
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
                mysqlConn.query(`SELECT id_registro, trabajadores.id_trabajador, fecha, trabajadores.nombre, 
                trabajadores.area, mascarillas.registro_user FROM mascarillas 
                INNER JOIN trabajadores ON mascarillas.id_trabajador = trabajadores.id_trabajador`, (err, rows, fields) => {
                    if (!err) {
                        if (rows.length > 0) {
                            res.json(rows)
                        } else {
                            res.json({ registros: "empty" })
                        }
                    } else {
                        console.log(err)
                    }
                })
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
                mysqlConn.query("DELETE FROM mascarillas WHERE id_registro = ?", [id], (err, rows, fields) => {
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
                mysqlConn.query("SELECT * FROM mascarillas WHERE id_registro = ?", [id], (err, rows, fields) => {
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
                mysqlConn.query("SELECT * FROM mascarillas WHERE " + req.query.filtro + " LIKE '%" + req.query.search + "%'", (err, rows, fields) => {
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

            let mascarilla = {}

            if (req.body.fecha) {
                mascarilla.fecha = req.body.fecha
            }

            if (req.body.id_trabajador) {
                mascarilla.id_trabajador = req.body.id_trabajador
            }

            if (req.body.registro_user) {
                mascarilla.registro_user = req.body.registro_user
            }


            mysqlConn.query("UPDATE mascarillas SET ? WHERE id_registro = ? ", [mascarilla, id_registro], (err, rows, fields) => {
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

            let mascarilla = {
                id_registro: 0,
                id_trabajador: req.body.id_trabajador,
                registro_user: req.body.registro_user,
                fecha: currentDay
            }

            mysqlConn.query('INSERT INTO mascarillas SET ?', [mascarilla], (err, rows, fields) => {
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