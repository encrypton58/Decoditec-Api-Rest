const express = require('express');
const mysqlConn = require('../database');
const router = express.Router();
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')

const route = '/api/herramientas'
const table = "herramientas"

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
                })
            }
        })
    })
    //eliminar registro
router.delete(route + '/delete/:id_herramienta', verifyToken, (req, res) => {
        let id = req.params.id_herramienta
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
                mysqlConn.query("DELETE FROM " + table + " WHERE id_herramienta = ?", [id], (err, rows, fields) => {
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
router.get(route + "/get/:id_herramienta", verifyToken, (req, res) => {
        const id = req.params.id_herramienta
        jwt.verify(req.token, "Marc", (err, authData) => {
            if (err) {
                res.json({
                    mensaje: "No se a podido verificar" +
                        "el token prueba a cerrar sesión o intentalo de nuevo"
                })
                console.log(err)
            } else {
                mysqlConn.query("SELECT * FROM " + table + " WHERE id_herramienta = ?", [id], (err, rows, fields) => {
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
router.put(route + "/edit/:id_herramienta", verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            let id_herramienta = req.params.id_herramienta

            let herramienta = {}

            if (req.body.nombre) {
                herramienta.nombre = req.body.nombre
                herramienta.id_herramienta = herramienta.nombre.substring(0, 3) + req.params.id_herramienta.substring(3)
                herramienta.id_herramienta = herramienta.id_herramienta.toLowerCase()
            }
            if (req.body.stock) {
                herramienta.stock = req.body.stock
            }
            if (req.body.caracteristicas) {
                herramienta.caracteristicas = req.body.caracteristicas
            }

            mysqlConn.query("UPDATE " + table + " SET ? WHERE id_herramienta = ? ", [herramienta, id_herramienta], (err, rows, fields) => {
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
            let herramienta = {
                nombre: req.body.nombre,
                caracteristicas: req.body.caracteristicas,
                stock: req.body.stock
            }

            let id = herramienta.nombre.substring(0, 3) + Math.round(Math.random() * 900);

            herramienta.id_herramienta = id.toLowerCase();

            mysqlConn.query('INSERT INTO ' + table + ' SET ?', [herramienta], (err, rows, fields) => {
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