const express = require('express')
const jwt = require('jsonwebtoken')
const mysqlConn = require('../database')
const by = require('bcryptjs')
const router = express.Router()

router.post('/login/api/', (req, res) => {

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
                    jwt.sign({ user }, 'Marc', (err, token) => {
                        res.json({ token })
                    })
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


})

module.exports = router;