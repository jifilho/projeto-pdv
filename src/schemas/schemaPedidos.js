const joi = require('joi');

const schemaPedido = joi.object({

    cliente_id: joi.number().integer().positive().required().messages({
        
        "number.empty": "O cliente_id é obrigatório.",
        "any.required": "O campo cliente_id é obrigatório.",
        "number.base": "O campo cliente_id deve ser preenchido com um número inteiro.",
        "integer.base": "O número dever ser inteiro.",
        "positive.base": "O campo cliente_id deve ser preenchido com um número positivo."
    }),

    observacao: joi.string().messages({}),

    pedido_produtos: joi.array().items(joi.object({

        produto_id: joi.number().integer().positive().required().messages({

            "number.empty": "O produto_id é obrigatório.",
            "any.required": "O campo produto_id é obrigatório.",
            "number.base": "O campo produto_id deve ser preenchido com um número inteiro.",
            "integer.base": "O número dever ser inteiro.",
            "positive.base": "O campo produto_id deve ser preenchido com um número positivo."
        }),
        quantidade_produto: joi.number().integer().positive().required().messages({

            "number.empty": "O quantidade_produto é obrigatório.",
            "any.required": "O campo quantidade_produto é obrigatório.",
            "number.base": "O campo quantidade_produto deve ser preenchido com um número inteiro.",
            "integer.base": "O número dever ser inteiro.",
            "positive.base": "O campo quantidade_produto deve ser preenchido com um número positivo."
        })

    })).required().messages({

        "array.empty": "O campo pedido_produtos é obrigatório.",
        "any.required": "O campo pedido_produtos é obrigatório."
    })
  
});


module.exports = {
    schemaPedido
};
