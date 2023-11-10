const {Pool} = require('pg')

const pool = new Pool ({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '818283abc',
    database: 'dindin'
})


module.exports = pool;