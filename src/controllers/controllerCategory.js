const pool = require("../database/connection")

const listarCategorias = async (req, res) => {
    try {
        const { rows } = await pool.query('select * from categorias');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ mensagem: `${error}` })
    }
}

module.exports = {
    listarCategorias
}