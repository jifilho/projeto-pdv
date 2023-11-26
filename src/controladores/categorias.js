const knex = require('../conexao')

const listarCategorias = async (req, res)=>{
    try {
        await knex.select('*').from('categorias').then((rows) => {return res.status(200).json(rows);
    })

    } catch (error) {
        return res.status (500).json({mensagem: error.message})
    }
}

module.exports = {
    listarCategorias
}