const express = require('express')
const mysqlConn = require('../database')
const router = express.Router()
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')

const route = '/api/trabajadores'



router.get(route + "/getAll", verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            mysqlConn.query("SELECT * FROM trabajadores", (err, rows, fields) => {
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



router.post(route + '/register', verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            let trabajador = {
                nombre: req.body.nombre,
                area: req.body.area
            }

            trabajador.id_trabajador = trabajador.area.substring(0, 3) + req.body.number

            mysqlConn.query('INSERT INTO trabajadores SET ?', [trabajador], (err, rows, fields) => {
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

router.delete(route + '/delete/:id_trabajador', verifyToken, (req, res) => {
    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {
            let id = req.params.id_trabajador
            mysqlConn.query("DELETE FROM trabajadores WHERE id_trabajador = ?", [id], (err, rows, fields) => {
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

router.get(route + "/get:id_trabajador", verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            const id = req.params.id_trabajador
            mysqlConn.query("SELECT * FROM trabajadores WHERE id_trabajador = ?", [id], (err, rows, fields) => {
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

router.get(route + "/search", verifyToken, (req, res) => {
    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {
            mysqlConn.query("SELECT * FROM trabajadores WHERE " + req.query.filtro + " LIKE '%" + req.query.search + "%'", (err, rows, fields) => {
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

router.put(route + "/edit/:id_trabajador", verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {
            let id = req.params.id_trabajador

            let edit = {}

            if (req.body.nombre) {
                edit.nombre = req.body.nombre
            }

            if(req.body.area){
                edit.area = req.body.area
                edit.id_trabajador = req.body.area.substring(0, 3) + id.substring(3, id.length)
            }

            if(req.body.number){
                edit.id_trabajador = id.substring(0,3) + req.body.number
            }

            if (req.body.area && req.body.number) {
                edit.area = req.body.area
                edit.id_trabajador = edit.area.substring(0, 3) + req.body.number;
            }

            mysqlConn.query(
                "UPDATE trabajadores SET ? WHERE id_trabajador = ?", [edit, id], (err, rows, fields) => {
                    if (!err) {
                        if (rows.affectedRows > 0) {
                            res.json({ editado: true })
                        } else {
                            res.json({ editado: false })
                        }
                    } else {
                        console.log(err)
                    }
                })
        }
    })
})



module.exports = router;