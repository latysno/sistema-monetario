const route = require('express').Router()
const rotasUser = require('./routesUser')
const rotasTransacoes = require('./routesTransacoes')


route.use(rotasUser)
route.use(rotasTransacoes)

module.exports = route


