const pool = require('../database/connection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const validacaoEmail = `select email from usuarios where email = $1`

        const { rowCount } = await pool.query(validacaoEmail, [email])

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' })
        }

        const { rows } = await pool.query(
            `insert into usuarios (nome, email, senha)
            values
            ($1,$2,$3) returning *
        `, [nome, email, senhaCriptografada])

        const { senha: _, ...user } = rows[0]
        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` })
    }
}

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body

    try {
        const query = `select * from usuarios where email = $1`
        const { rowCount, rows } = await pool.query(query, [email])

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const { senha: senhaUsuario, ...usuario } = rows[0]

        const validacaoSenha = await bcrypt.compare(senha, senhaUsuario)

        if (!validacaoSenha) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const token = jwt.sign({ id: usuario.id }, senhaJwt, { expiresIn: '8h' });

        return res.json({
            usuario,
            token
        })

    } catch (error) {
        return res.status(500).json({ mensagem: `{error}` })
    }
}

const detalharUsuario = async (req, res) => {
    const { id } = req.usuario;
    try {
        const { rowCount, rows } = await pool.query(`select * from usuarios where id = $1`, [id])
        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'usuario não encontrado' })
        }
        const { senha, ...user } = rows[0]
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` })
    }
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const validacaoEmail = `select * from usuarios where email = $1`
        const { rowCount } = await pool.query(validacaoEmail, [email])

        if (rowCount === 0) {
            const { rows } = await pool.query(
                `
                update usuarios set nome = $1, email = $2, senha = $3 where id = $4 returning *
                `
                , [nome, email, senhaCriptografada, req.usuario.id])

            const { senha: _, ...user } = rows[0]

            return res.status(204).json()
        }

        return res.status(400).json({ mensagem: 'O email informado já estar sendo utilizado por outro usuário' })

    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` })
    }
}


module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario
}