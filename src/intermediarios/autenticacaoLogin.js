require('dotenv').config();
const knex = require('../conexao');
const jwt = require('jsonwebtoken');

const verificarUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Usuário não autorizado!' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, process.env.JWTSECRET);

        const usuario = await knex('usuarios').where('id', id);
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Usuário não encontrado!' });
        }

        req.usuario = usuario[0];

        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Usuário não autorizado!' });
    }
}

module.exports = {
    verificarUsuarioLogado
}