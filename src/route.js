// const { Router } = require("express");
// const { cadastrarUsuario, loginUsuario, detalharUsuario, atualizarUsuario } = require("./controllers/controllerUsuario");
// const { validacaoToken } = require("./middlewares/validacaoToken");

// const route = Router();
// const { listarTransacoes, cadastrarTransacao, obterExtrato, atualizarTransacao, excluirTransacao, detalharTransacaoUsuario } = require("./controllers/controllerTransactions");
// const { listarCategorias } = require("./controllers/controllerCategory")
// const { validacaoCadastrarUsuario, validacaoLoginUsuario, validacaoCadastrarTransacao, validacaoAtualizarTransacao } = require("./middlewares/validacaoPropriedades")

// // rotas usuario
// route.post('/usuario', validacaoCadastrarUsuario, cadastrarUsuario)
// route.post('/login', validacaoLoginUsuario, loginUsuario)

// route.use(validacaoToken) //validação com o token

// route.get('/usuario', detalharUsuario)
// route.put('/usuario', validacaoCadastrarUsuario, atualizarUsuario)

// //  categorias e transações
// route.get('/categoria', listarCategorias)
// route.get('/transacao', listarTransacoes)
// route.get('/transacao/extrato', obterExtrato)
// route.get('/transacao/:id', detalharTransacaoUsuario)
// route.post('/transacao', validacaoCadastrarTransacao, cadastrarTransacao)
// route.put('/transacao/:id', validacaoAtualizarTransacao, atualizarTransacao)
// route.delete('/transacao/:id', excluirTransacao)








// module.exports = route