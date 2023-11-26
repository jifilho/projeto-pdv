const joi = require('joi')

const schemaProduto = joi.object({
    descricao: joi.string().required().messages({
        'string.empty': 'O campo descricao é obrigatório.',
        'any.required': 'O campo descricao é obrigatório.'
    }),
    quantidade_estoque: joi.number().required().min(1).messages({
        'number.empty': 'O campo quantidade_estoque é obrigatório.',
        'any.required': 'O campo quantidade_estoque é obrigatório.',
        'number.base': 'quantidade_estoque precisa ser um número.',
        'number.min': 'quantidade_estoque deve ser maior que zero.'
    }),
    valor: joi.number().required().min(1).messages({
        'number.empty': 'O campo valor é obrigatório.',
        'any.required': 'O campo valor é obrigatório.',
        'number.base': 'valor precisa ser um número.',
        'number.min': 'O valor deve ser maior que zero.'
    }),
    categoria_id: joi.number().required().messages({
        'number.empty': 'O campo categoria_id é obrigatório.',
        'any.required': 'O campo categoria_id é obrigatório.',
        'number.base': 'categoria_id precisa ser um número.'
    })
});


module.exports = {
    schemaProduto
}