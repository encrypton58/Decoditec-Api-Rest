const express = require('express');
const mysqlConn = require('../database');

const router = express.Router()
const verifyToken = require('../CheckToken.js')
const jwt = require('jsonwebtoken')

const route = '/api/vs'


router.post(route + '/register', (req, res) => {

    let noFolio = req.body.noFolio
    let nombre = req.body.nombre
    let fecha = req.body.fecha
    let proyecto = req.body.proyecto
    let recibio = req.body.recibio
    let entrego = req.body.entrego
    let observacion = req.body.observacion

    // let materiales = JSON.parse(req.body.materiales)

    res.send(req.body);

    // let materialesJson = getItemsMateriales(materiales)

    // let vale = {
    //     "nombre": nombre,
    //     "noFoliio": noFolio,
    //     "fecha": fecha,
    //     "proyecto": proyecto,
    //     "materiales": materialesJson,
    //     "recibio": recibio,
    //     "entrego": entrego,
    //     "observaciones": observacion || ""
    // }

    // res.json(vale)

})

function getItemsMateriales(materiales) {
    let materialesJson = []
    let i = 0
    while (i <= materiales.length - 1) {
        materialesJson.push({ "material": materiales[i].material, "cantidad": materiales[i].cantidad });
        i = i + 1
    }

    return materialesJson
}

module.exports = router