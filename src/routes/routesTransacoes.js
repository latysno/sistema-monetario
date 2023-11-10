const express = require('express');
const routesTransacoes = express();

const { validacaoToken } = require('../middlewares/validacaoToken');
const { listarCategorias } = require('../controllers/controllerCategory');
const {  atualizarTransacao, excluirTransacao, listarTransacoes, obterExtrato, detalharTransacaoUsuario, cadastrarTransacao } = require('../controllers/controllerTransactions');
const { validacaoCadastrarTransacao, validacaoAtualizarTransacao } = require('../middlewares/validacaoPropriedades');

routesTransacoes.use(validacaoToken) //validação com o token

routesTransacoes.get('/categoria', listarCategorias)
routesTransacoes.get('/transacao', listarTransacoes)
routesTransacoes.get('/transacao/extrato', obterExtrato)
routesTransacoes.get('/transacao/:id', detalharTransacaoUsuario)
routesTransacoes.post('/transacao', validacaoCadastrarTransacao, cadastrarTransacao)
routesTransacoes.put('/transacao/:id', validacaoAtualizarTransacao, atualizarTransacao)
routesTransacoes.delete('/transacao/:id', excluirTransacao)

module.exports = routesTransacoes;