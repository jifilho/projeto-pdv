const knex = require('../conexao');

const validaCamposCadastroPedido = (joiSchema) => async (req, res, next) => {

  try {
    
    await joiSchema.validateAsync(req.body)

    next();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message })
  }
};

const validaSeExisteClienteId = async (req, res, next) => {

    const { cliente_id: id } = req.body

    try{

        const queryCliente = await knex('clientes').where({id}).first().debug()

        if(!queryCliente){

            return res.status(404).json({mensagem: `O cliente não foi encontrado.`})

        } 

        next()

    }catch(error){
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
    }

}

const validaSeExisteProdutoId = async (req, res, next) => {

    const { pedido_produtos } = req.body

    try{

        const produtosNaoEncontrados = []

        for (const produto of pedido_produtos) {
            const queryProdutos = await knex('produtos').where({ id: produto.produto_id }).first().debug()
            
            if (!queryProdutos) {
                produtosNaoEncontrados.push(produto.produto_id);
            }
        }

        if(produtosNaoEncontrados.length > 0){
            return res.status(404).json({mensagem: `O(s) produto(s) ${produtosNaoEncontrados.join(', ')} não foi/foram encontrado(s).`})
        }

        next();

    }catch(error){
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
    }

}


const validaQuantidadeProduto = async (req, res, next) => {

    const { pedido_produtos } = req.body


    try{

        const produtosComQuantidadeInsuficiente = []

        for(produto of pedido_produtos){

            const queryProdutos = await knex('produtos').where({id: produto.produto_id}).first().debug()

            if(queryProdutos.quantidade_estoque < produto.quantidade_produto){
                
                produtosComQuantidadeInsuficiente.push({
                    id: produto.produto_id, 
                    quantidadeSolicitadaNoPedido: produto.quantidade_produto, 
                    quantidadeDisponivelNoEstoque:  queryProdutos.quantidade_estoque
                })

            }

        }

        if (produtosComQuantidadeInsuficiente.length > 0) {
            return res.status(400).json({
                mensagem: `Os seguintes produtos possuem uma quantidade superior de pedido do que o disponível em estoque`,
                produtos: produtosComQuantidadeInsuficiente
            });
        }

        next()


    } catch(error){
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
    }


}


module.exports = {
    validaCamposCadastroPedido,
    validaSeExisteClienteId,
    validaSeExisteProdutoId,
    validaQuantidadeProduto
}