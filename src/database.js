const mysql = require('mysql')

const mysqlConn = mysql.createConnection({
    host: 'mysql-marc58.alwaysdata.net',
    user: 'marc58',
    password: 'marcusclasic2',
    database: 'marc58_node_almacen'
})


mysqlConn.connect((error) => {
    if (error) {
        console.log(error)
        return
    } else {
        console.log("db conectada")
    }
});

module.exports = mysqlConn;