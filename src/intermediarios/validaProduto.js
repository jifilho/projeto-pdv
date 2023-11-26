const knex = require('../conexao')

const validaCamposAtualizacaoProduto = (joiSchema) => async (req, res, next) => {

    try{

        await joiSchema.validateAsync(req.body)

        next()

    }catch(error){
        res.status(400).json({mensagem: error.message})
    }

}

const validaExisteIdProduto = async (req,res,next) =>{
    const {id} = req.params

    const selecionarProduto = await knex('produtos').select('*').where({id}).first()

    if (!selecionarProduto){
        return res.status(404).json({mensagem: "Produto não encontrado."})
    }

    next()
}

const validaExisteIdCategoria = async (req,res,next)=>{
    const {categoria_id} = req.body

    const selecionarCategoriaDoProduto = await knex('categorias').select('*').where({id: categoria_id}).first()

    if (!selecionarCategoriaDoProduto){
        return res.status(404).json({mensagem: "Categoria não encontrada."})
    }

    next()
}

module.exports = {
    validaCamposAtualizacaoProduto,
    validaExisteIdProduto,
    validaExisteIdCategoria
}