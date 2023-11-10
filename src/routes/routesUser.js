const express = require('express');
const routesUser = express();

const { cadastrarUsuario, loginUsuario, atualizarUsuario, detalharUsuario } = require('../controllers/controllerUsuario');
const { validacaoToken } = require('../middlewares/validacaoToken');
const { validacaoCadastrarUsuario, validacaoLoginUsuario } = require('../middlewares/validacaoPropriedades');


routesUser.post('/usuario', validacaoCadastrarUsuario, cadastrarUsuario)
routesUser.post('/login', validacaoLoginUsuario, loginUsuario)

routesUser.use(validacaoToken) //validação com o token

routesUser.get('/usuario', detalharUsuario)
routesUser.put('/usuario', validacaoCadastrarUsuario, atualizarUsuario)

module.exports = routesUser;