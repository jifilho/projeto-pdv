const atualizarUsuario = (req, res, next) => {
    let { nome, email, senha } = req.body;

    if (!nome && !email && !senha) {
        return res
          .status(404)
          .json("É obrigatório informar ao menos um campo para atualização");
    }

      next();
}




module.exports = atualizarUsuario;