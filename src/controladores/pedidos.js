const knex = require('../conexao');
const transportador = require('../servicos/email')
const compiladorHtml = require('../utils/compiladorHtml')

const cadastrarPedidos = async (req, res) => {

    const {  cliente_id, observacao, pedido_produtos } = req.body

    try{

        const valorTotalPorProduto = []
        const pedidosParaEnviarPorEmail = []

        for(pedido of pedido_produtos){

            const produtoNoEstoque = await knex('produtos').select('descricao','valor', 'quantidade_estoque').where({id: pedido.produto_id}).first()

            const valorPedidoPorProduto =  pedido.quantidade_produto * produtoNoEstoque.valor

            valorTotalPorProduto.push(valorPedidoPorProduto)

            const novaQtdEstoque = produtoNoEstoque.quantidade_estoque - pedido.quantidade_produto

            pedidosParaEnviarPorEmail.push({descricao: produtoNoEstoque.descricao, quantidade: pedido.quantidade_produto, valorUnitario: (produtoNoEstoque.valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})

            await knex('produtos').update({quantidade_estoque: novaQtdEstoque}).where({id: pedido.produto_id})

        }

        const valorTotalPedido = valorTotalPorProduto.reduce((acumulador, valorAtual) => {

            return acumulador += valorAtual

        })

        const cadastraPedido = await knex('pedidos').insert({cliente_id, observacao, valor_total:  valorTotalPedido}).returning('id')

        const idPedido = cadastraPedido[0].id

   
        for(pedidoProduto of pedido_produtos){

            const valorProduto = await knex('produtos').select('valor').where({id: pedidoProduto.produto_id}).first()

            await knex('pedido_produtos').insert({

                pedido_id: idPedido, 
                produto_id: pedidoProduto.produto_id,
                quantidade_produto: pedidoProduto.quantidade_produto,
                valor_produto: valorProduto.valor
                
             })

        }

        const cliente = await knex('clientes').where({id: cliente_id}).first()

        const html = await compiladorHtml('./src/templates/pedido.html',{
            nomeusuario: cliente.nome,
            resumoPedido: pedidosParaEnviarPorEmail,
            valorTotal: (valorTotalPedido / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        })

        transportador.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${cliente.nome} <${cliente.email}>`,
            subject: 'Confirmação de pedido',
            html
        })

        res.status(201).json({mensagem: 'Pedido cadastrado com sucesso'})
       
    }catch(error){
        console.log(error)
        res.status(500).json({mensagem: 'Erro interno no servidor'})

    }

}

async function listarPedido(req,res){
    const {cliente_id} = req.query;

    try {
        if(cliente_id){
            const resultado = await knex('pedidos').where({cliente_id});
            return res.status(200).json({resultado});
        }

        const resultado = await knex.select("*").from('pedidos');

        return res.status(200).json({resultado});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Erro no servidor");
    }
}

module.exports = {
    cadastrarPedidos,
    listarPedido
}