const knex = require('../conexao')
require('dotenv').config();

const detalharClientes = async (req, res) => {
    const { id } = req.params


    try {
        const cliente = await knex('clientes').where({ id }).first().debug()
        return res.status(200).json(cliente)



    } catch (error) {
        return res.status(500).json({ menssagem: 'Erro interno do Servidor' })
    }

}


const cadastrarCliente = async (req, res) => {

    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body

    const novoCliente = {

        nome: nome ? nome.trim() : null,
        email: email ? email.trim() : null,
        cpf: cpf ? cpf.trim() : null,
        cep: cep ? cep.trim() : null,
        rua: rua ? rua.trim() : null,
        numero: numero ? numero.trim() : null,
        bairro: bairro ? bairro.trim() : null,
        cidade: cidade ? cidade.trim() : null,
        estado: estado ? estado.trim() : null
    }

    try {

        await knex('clientes').insert(novoCliente).debug()

        return res.status(201).json({ mensagem: `O(a) cliente ${novoCliente.nome} foi cadastrado(a) com sucesso!` })

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' })
    }

}


const listarClientes = async (req, res) => {

    try {

        const clientes = await knex('clientes').debug()

        res.status(200).json(clientes)

    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno no servidor" })
    }


}

const atualizarDadosCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const clienteAtualizado  = await knex("clientes").where({ id }).update(req.body);

        if (!clienteAtualizado ) {
            return res.status(400).json({mensagem: "O cliente não foi atualizado"});
        }

        return res.status(200).json({mensagem: "Cliente foi atualizado com sucesso."});
    } catch (error) {
        return res.status(400).json({ mensagem: error.message});
    }

};

module.exports = {
    detalharClientes,
    cadastrarCliente,
    listarClientes,
    atualizarDadosCliente
}