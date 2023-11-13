const pool = require("../database/connection")
const {  parseISO, isValid } = require("date-fns")


const listarTransacoes = async (req, res) => {
    const { id } = req.usuario;
    try {
        const { rows } = await pool.query('select * from transacoes where usuario_id = $1', [id])
        return res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ mensagem: `${error}` })
    }
}

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const { id } = req.usuario;

    try {
        const dataValida = parseISO(data)
        if (!isValid(dataValida)) {
            return res.status(400).json({ mensagem: "A data informada não é válida" });
        }
        const { rows, rowCount } = await pool.query('select * from categorias where id =$1', [categoria_id])
        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "A categoria informada não existe." })
        }
        const transacao = await pool.query('insert into transacoes(tipo, descricao, valor, data, usuario_id, categoria_id) values ($1, $2, $3, $4, $5, $6) returning *', [tipo, descricao, valor, dataValida, id, categoria_id])
        const resultado = {
            ...transacao.rows[0],
            categoria_nome: rows[0].descricao
        }
        return res.status(201).json(resultado)

    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` });
    }
}

const obterExtrato = async (req, res) => {
    try {
        const entrada = await pool.query(`select sum(valor) as entrada from transacoes where tipo = $1 and usuario_id = $2`, ['entrada', req.usuario.id])
        const saida = await pool.query(`select sum(valor) as saida from transacoes where tipo = $1 and usuario_id = $2`, ['saida', req.usuario.id])

        const result = {
            entrada: Number(entrada.rows[0].entrada ?? 0),
            saida: Number(saida.rows[0].saida ?? 0)
        }
        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` })
    }
}

const detalharTransacaoUsuario = async (req, res) => {
    const { id } = req.usuario
    const identificador = Number(req.params.id);
    try {
        const { rows, rowCount } = await pool.query(`select * from transacoes where id = $1 and usuario_id = $2`, [identificador, id])
        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }
        const categoria = await pool.query(`select * from categorias where id = $1`, [rows[0].categoria_id])

        const result = {
            id: rows[0].id,
            tipo: rows[0].tipo,
            descricao: rows[0].descricao,
            valor: rows[0].valor,
            data: rows[0].data,
            usuario_id: rows[0].usuario_id,
            categoria_id: rows[0].categoria_id,
            categoria_nome: categoria.rows[0].descricao
        }
        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` });
    }
}

const atualizarTransacao = async (req, res) => {
    const { id } = req.usuario
    const identificador = Number(req.params.id);
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    try {
        const { rows, rowCount } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [identificador, id]);
        if (rowCount < 1) {
            return res.status(404).json({ mensagem: " Não existe transação para o id enviado como parâmetro na rota ou esta transação não pertence ao usuário logado." });
        }
        const categoria = await pool.query('select * from categorias where id = $1', [categoria_id])
        if (categoria.rowCount < 1) {
            return res.status(404).json({ mensagem: "Não existe categoria para o categoria_id enviado no corpo (body) da requisição" })
        }
        const atualizacaoNoBanco = await pool.query('update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6', [descricao, valor, data, categoria_id, tipo, identificador]);
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ mensagem: `${error}` })
    }
}

const excluirTransacao = async (req, res) => {
    const { id } = req.usuario;
    const identificador = Number(req.params.id);
    try {
        const { rowCount } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [identificador, id])
        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "Transação não encontrada" });
        }
        const { rows } = await pool.query('delete from transacoes where id = $1', [identificador]);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` })
    }
}

module.exports = {
    listarTransacoes,
    cadastrarTransacao,
    obterExtrato,
    atualizarTransacao,
    excluirTransacao,
    detalharTransacaoUsuario
}