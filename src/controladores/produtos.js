const knex = require('../conexao')
const { excluirImagem, uploadFile } = require('../servicos/upload')

async function listarProdutos(req, res) {

    const { categoria_id } = req.query;

    try {

        if (categoria_id) {

            const resultado = await knex('produtos').where({ categoria_id });

            if (resultado.length < 1) {
                return res.status(404).json({ mensagem: 'Não existe produto cadastrado com a categoria digitada.' })
            }

            return res.status(200).json(resultado);
        }

        const resultado = await knex.select("*").from("produtos");

        return res.json(resultado);
    } catch (error) {
        return res.json({ mensagem: 'Erro interno no servidor' });
    }
}

async function cadastrarProdutos(req, res) {

    const { descricao, quantidade_estoque, valor, categoria_id  } = req.body;
    
    try {

        if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
            return res.status(400).json({ mensagem: "Verififque todos os campos necessarios" });
        }

        if(quantidade_estoque < 0){
            return res.status(400).json({mensagem: "Quantidade menor que 1"});
        }

        if(valor < 0){
            return res.status(400).json({mensagem: "Valor menor que 1"});
        }
        

        const resultadoCategoria = await knex.select("*").from("categorias").where("id", categoria_id);

        if (resultadoCategoria.length == 0) {
            return res.status(404).json({ mensagem: "A categoria não existe!" });
        }

      
    
        const resultadoCadastro = await knex("produtos").returning("*").insert({ descricao: descricao, quantidade_estoque: quantidade_estoque, valor: valor, categoria_id: categoria_id });

        const { id } = resultadoCadastro[0]


        let originalnameFora = ''
        let mimetypeFora = ''
        let bufferFora = ''
    
        if(req.file){
            const { originalname, mimetype, buffer } = req.file
            originalnameFora = originalname
            mimetypeFora = mimetype
            bufferFora = buffer

            const imagem = await uploadFile(
                `imagens/${id}/${originalname}`,
                buffer,
                mimetype
            )
    
            const produto = await knex('produtos').update({
                produto_imagem: imagem.url
            }).where({ id }).returning('*')

            return res.status(201).json(produto[0]);

        }

        return res.status(201).json(resultadoCadastro[0]);

    } catch (error) {
       
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });

    }
}

const detalharProduto = async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await knex('produtos').where('id', id);

        if (produto.length < 1) {
            return res.status(400).json({ mensagem: "Produto não encontrado" });
        }

        return res.status(200).json(produto[0]);

    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const excluirProdutoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const produto = await knex('produtos').where('id', id).first();

        if (produto.length < 1) {
            return res.status(400).json({ mensagem: "Produto não encontrado" });
        }

        const produtoVinculadoPedido = await knex('pedido_produtos').where('produto_id', id);

        if (produtoVinculadoPedido.length > 0) {
            return res.status(400).json({ mensagem: "Produto não pode ser removido por estar vinculado a pelo menos um pedido!" });
        }

        await excluirImagem(produto.produto_imagem)

        await knex('produtos').del().where('id', id);

        return res.status(200).json({ mensagem: "Produto excluído com sucesso!" });

    } catch (error) {
       
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}
const atualizarProduto = async (req, res) => {

    let { id } = req.params;
    let { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    try {

        const propriedades = ["descricao", "quantidade_estoque", 'valor', 'categoria_id']

        for(const propriedade of propriedades) {
            if(!req.body[propriedade]) {
                return res.status(400).json({mensagem: `Ocorreu um erro: ${propriedade} é obrigatório`});
            }
        }

        if(quantidade_estoque < 0){
            return res.status(400).json({mensagem: `A quantidade do estoque não pode ser um número negativo`});
        }

        if(valor < 0){
            return res.status(400).json({mensagem: `O valor não pode ser um número negativo`});
        }

        const categoria = await knex('categorias')
            .where('id', '=', categoria_id)
            .first();

        if (!categoria) {
            return res.status(400).json({
                mensagem: 'Não existe categoria para o ID de categoria informado'
            });
        }

       const produtoAtualizado =  await knex('produtos')
            .where({id})
            .update({
                descricao: descricao,
                quantidade_estoque: quantidade_estoque,
                valor: valor,
                categoria_id: categoria_id
            }).returning('*');

        let produto = await knex('produtos')
        .where({id})
        .first();

            let originalnameFora = ''
            let mimetypeFora = ''
            let bufferFora = ''

            if(req.file){

                await excluirImagem(produto.produto_imagem);
                
                const { originalname, mimetype, buffer } = req.file
                originalnameFora = originalname
                mimetypeFora = mimetype
                bufferFora = buffer
    
                const imagem = await uploadFile(
                    `imagens/${id}/${originalname}`,
                    buffer,
                    mimetype
                )
        
                const produtoDentroDoIf = await knex('produtos').update({
                    produto_imagem: imagem.url
                }).where({ id }).returning('*')
    
                return res.status(201).json(produtoDentroDoIf[0]);
    
            }    

        return res.status(200).json(produtoAtualizado[0])

    } catch (erro) {
        return res.status(400).json({ 'mensagem': erro.message });
    }
}


module.exports = {
    listarProdutos,
    cadastrarProdutos,
    detalharProduto,
    excluirProdutoPorId,
    atualizarProduto
}