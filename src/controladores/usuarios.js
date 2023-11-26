require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../conexao');

const efetuarLogin = async (req, res) => {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'Valide se está informando as proprieadades obrigatórias: email e senha' });
        }

        const buscar = await knex('usuarios').where('email', email);

        if (buscar.length < 1) {
            return res.status(400).json({ mensagem: "E-mail e/ou senha inválido(s)." });
        }

        const usuario = buscar[0];

        if (!await bcrypt.compare(senha, usuario.senha)) {
            return res.status(400).json({ mensagem: "E-mail e/ou senha inválido(s)." });
        }
        let { senha: senhaDoUsuario, ...usuarioSemSenha } = usuario;

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWTSECRET,
            {
                "expiresIn": "2h"
            }
        )
        return res.status(200).json({ usuario: usuarioSemSenha, token });

    } catch (error) {
        return res.status(500).json({ mensagem: error.message });
    }
}

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'nome, Email e senha são campos obrigatórios, por favor verifique suas informações e tente novamente.' });
    }

    try {

        const usuario = await knex('usuarios').select('email').where('email', email).first();

        if (usuario) {
            return res.status(400).json({ mensagem: "usuario ja cadastrado" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastrarUsuario = await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada
            })
            .returning(['nome', 'email']);

        if (cadastrarUsuario.length === 0) {
            return res.status(400).json({ mensagem: 'Não foi possivel cadastrar o usuário.' })
        }

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const detalharUsuario = async (req, res) => {

    const { id } = req.usuario

    try {

        const usuario = await knex('usuarios').select('nome', 'email').where({ id });

        res.status(200).json(usuario[0])

    } catch (error) {
        res.status(500).json({ menssagem: 'Erro interno no servidor.' })
    }

}


const atualizarPerfil = async (req, res) => {
    const { id } = req.usuario;
    let {nome, email,senha} = req.body

    try {
        const usuarioExiste = await knex("usuarios").where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json({mensagem: "Usuario não encontrado"});
        }

        if (senha) {
            senha = await bcrypt.hash(senha, 10);
        }

        if (email && email !== req.usuario.email) {
            const emailUsuarioExiste = await knex("usuarios")
                .where({ email })
                .first();

            if (emailUsuarioExiste) {
                return res.status(404).json({mensagem: "O Email já existe."});
            }
        }

        const usuarioAtualizado = await knex("usuarios").where({ id }).update({
            nome,
            email,
            senha
        });

        if (!usuarioAtualizado) {
            return res.status(400).json({mensagem: "O usuario não foi atualizado"});
        }

        return res.status(200).json({mensagem: "Usuario foi atualizado com sucesso."});
    } catch (error) {
        return res.status(400).json({mensagem: 'Erro interno no servidor'});
    }
};


module.exports = {
    detalharUsuario,
    cadastrarUsuario,
    efetuarLogin,
    atualizarPerfil
}




