const knex = require("../conexao");

const validaCamposCadastroCliente = (joiSchema) => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.body);

    next();
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
};

const validaExisteEmailCpfCliente = async (req, res, next) => {
  const { email, cpf } = req.body;

  try {
    const queryExisteEmail = await knex("clientes")
      .select("email")
      .where({ email })
      .first()
      .debug();

    const queryExisteCpf = await knex("clientes")
      .select("cpf")
      .where({ cpf })
      .first()
      .debug();

    if (queryExisteEmail && queryExisteCpf) {
      return res.status(400).json({
        mensagem: "Já existe cadastro para o e-mail e cpf digitados.",
      });
    }

    if (queryExisteEmail) {
      return res
        .status(400)
        .json({ mensagem: "Já existe cadastro para o e-mail digitado." });
    }

    if (queryExisteCpf) {
      return res
        .status(400)
        .json({ mensagem: "Já existe cadastro para o cpf digitado." });
    }

    next();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const validaSeClienteExiste = async (req, res, next) => {
  const { id } = req.params;

  try {
    const cliente = await knex("clientes").where({ id }).first().debug();

    if (!cliente) {
      return res.status(404).json({ menssagem: "Cliente não encontrado" });
    }
    next();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

const validaCamposObrigatorios = (joiSchema) => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.body);

    next();
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
};

const validaEntradaAtualizarCliente = async (req, res, next) => {
  const { id } = req.params;
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;

  try {
    const clienteExiste = await knex("clientes").where({ id }).first();

    if (!clienteExiste) {
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    }

    if (
      nome === clienteExiste.nome &&
      email === clienteExiste.email &&
      cpf === clienteExiste.cpf &&
      !cep &&
      !rua &&
      !numero &&
      !bairro &&
      !cidade &&
      !estado
    ) {
      return res.status(200).json(req.body);
    }

    if (email || cpf) {
      const emailClienteExiste = await knex("clientes").where({ email }).first();
      const cpfClienteExiste = await knex("clientes").where({ cpf }).first();

      if (emailClienteExiste !== emailClienteExiste.email) {
        return res.status(404).json({ mensagem: "O Email já existe." });
      }

      if (cpfClienteExiste !== cpfClienteExiste.cpf) {
        return res.status(404).json({ mensagem: "O CPF já existe." });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
};

module.exports = {
  validaCamposCadastroCliente,
  validaExisteEmailCpfCliente,
  validaSeClienteExiste,
  validaCamposObrigatorios,
  validaEntradaAtualizarCliente,
};
