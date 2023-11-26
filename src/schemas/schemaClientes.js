const joi = require('joi');

const schemaCliente = joi.object({
  nome: joi.string().required().messages({
    "string.empty": "O campo nome é obrigatório.",
    "any.required": "O campo nome é obrigatório.",
  }),

  email: joi.string().email().required().messages({
    "string.email": "O campo email precisa ter um formato válido.",
    "any.required": "O campo email é obrigatório.",
    "string.empty": "O campo email é obrigatório.",
  }),

  cpf: joi.string().min(11).max(11).required().messages({
    "string.min": "O campo cpf precisa ter 11 digitos. Sem pontos ou traços, apenas números",
    "string.max": "O campo cpf precisa ter 11 digitos. Sem pontos ou traços, apenas números",
    "any.required": "O campo cpf é obrigatório.",
    "string.empty": "O campo cpf é obrigatório.",
  }),

  cep: joi.string().min(8).max(8).messages({
    "string.min":
      "O campo cep precisa ter 8 digitos. Sem pontos ou traços, apenas números",
    "string.max":
      "O campo cep precisa ter 8 digitos. Sem pontos ou traços, apenas números",
  }),

  rua: joi.string().messages({}),
  numero: joi.string().messages({}),
  bairro: joi.string().messages({}),
  cidade: joi.string().messages({}),
  estado: joi.string().messages({}),
});

const schemaAlterarCliente = joi.object({
  nome: joi.string().required().messages({
    "string.empty": "O campo nome é obrigatório.",
    "any.required": "O campo nome é obrigatório.",
  }),

  email: joi.string().email().required().messages({
    "string.email": "O campo email precisa ter um formato válido.",
    "any.required": "O campo email é obrigatório.",
    "string.empty": "O campo email é obrigatório.",
  }),

  cpf: joi.string().min(11).max(11).required().messages({
    "string.min":
      "O campo cpf precisa ter 11 digitos. Sem pontos ou traços, apenas números",
    "string.max":
      "O campo cpf precisa ter 11 digitos. Sem pontos ou traços, apenas números",
    "any.required": "O campo cpf é obrigatório.",
    "string.empty": "O campo cpf é obrigatório.",
  }),
  
  cep: joi.string().min(8).max(8).messages({
    "string.min":
      "O campo cep precisa ter 8 digitos. Sem pontos ou traços, apenas números",
    "string.max":
      "O campo cep precisa ter 8 digitos. Sem pontos ou traços, apenas números",
  }),

  rua: joi.string().messages({}),
  numero: joi.string().messages({}),
  bairro: joi.string().messages({}),
  cidade: joi.string().messages({}),
  estado: joi.string().messages({}),
});

module.exports = {
  schemaCliente,
  schemaAlterarCliente,
};
