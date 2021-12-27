const express = require('express');
const mysqlConn = require('../database')
const router = express.Router()
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')

const route = '/api/sda'

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

            let salida_de_almacen = {
                id_registro_salida: 0,
                id_trabajador: req.body.id_trabajador,
                material: req.body.material,
                proyecto: req.body.proyecto,
                fecha: currentDay,
                registro_user: req.body.registro_user
            }

            mysqlConn.query('INSERT INTO salidas_de_almacen SET ?', [salida_de_almacen], (err, rows, fields) => {
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

router.get(route + '/getAll', verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            mysqlConn.query('SELECT * FROM salidas_de_almacen', (err, rows, fields) => {
                if (!err) {
                    if (rows.length > 0) {
                        res.json(rows)
                    } else {
                        res.json({ registros: "empty" })
                    }
                } else {
                    console.log(err);
                }
            })
        }
    })

})

router.get(route + '/search', verifyToken, (request, response) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {

            let query = `SELECT * FROM salidas_de_almacen WHERE
     ${request.query.filtro} LIKE '%${request.query.search}%'`

            mysqlConn.query(query, (err, rows, fields) => {
                if (!err) {
                    response.json(rows)
                } else {
                    console.log(err)
                }
            })
        }
    })
})

router.delete(route + '/delete/:id_registro_salida', verifyToken, (req, res) => {
    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {
            let id_registro_salida = req.params.id_registro_salida

            mysqlConn.query('DELETE FROM salidas_de_almacen WHERE id_registro_salida = ?', [id_registro_salida], (err, rows, fields) => {
                if (!err) {
                    if (rows.affectedRows > 0) {
                        res.json({ delete: true })
                    } else {
                        res.json({ delete: false })
                    }
                } else {
                    console.log(err)
                }
            })
        }
    })
})

router.get(route + "/get/:id_registro_salida", verifyToken, (req, res) => {
    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {
            const id = req.params.id_registro_salida
            mysqlConn.query("SELECT * FROM salidas_de_almacen WHERE id_registro_salida = ?", [id], (err, rows, fields) => {
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

router.put(route + "/edit/:id_registro_salida", verifyToken, (req, res) => {

    jwt.verify(req.token, "Marc", (err, authData) => {
        if (err) {
            res.json({
                mensaje: "No se a podido verificar" +
                    "el token prueba a cerrar sesión o intentalo de nuevo"
            })
            console.log(err)
        } else {
            let id = req.params.id_registro_salida

            let edit = {}

            if (req.body.material) {
                edit.material = req.body.material
            }
            if (req.body.fecha) {
                edit.fecha = req.body.fecha
            }
            if (req.body.proyecto) {
                edit.proyecto = req.body.proyecto
            }

            mysqlConn.query("UPDATE salidas_de_almacen SET ? WHERE id_registro_salida = ? ", [edit, id], (err, rows, fields) => {
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

module.exports = router