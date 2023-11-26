const express = require("express");
const { listarCategorias } = require("./controladores/categorias");
const { detalharUsuario, cadastrarUsuario, efetuarLogin, atualizarPerfil} = require("./controladores/usuarios");
const atualizarUsuario = require("./intermediarios/atualizarUsuario");
const { cadastrarCliente, listarClientes, detalharClientes, atualizarDadosCliente } = require("./controladores/clientes");
const { verificarUsuarioLogado } = require("./intermediarios/autenticacaoLogin");
const { validaCamposCadastroCliente, validaExisteEmailCpfCliente, validaSeClienteExiste, validaCamposObrigatorios, validaEntradaAtualizarCliente } = require("./intermediarios/validaCliente");
const { validaCamposAtualizacaoProduto, validaExisteIdProduto, validaExisteIdCategoria } = require("./intermediarios/validaProduto");
const { schemaCliente, schemaAlterarCliente } = require("./schemas/schemaClientes");
const { detalharProduto, excluirProdutoPorId, editarDadosProduto, listarProdutos, cadastrarProdutos, cadastrarProduto, atualizarProduto } = require("./controladores/produtos");
const { schemaProduto } = require("./schemas/schemaProdutos");
const { cadastrarPedidos, listarPedido } = require('./controladores/pedidos');
const { validaCamposCadastroPedido, validaSeExisteClienteId, validaSeExisteProdutoId, validaQuantidadeProduto } = require("./intermediarios/validaPedido");
const { schemaPedido } = require("./schemas/schemaPedidos");
const { cadastrarImagem } = require("./servicos/upload");
const multer = require('../src/intermediarios/multer')

const rotas = express.Router();

rotas.get("/categoria", listarCategorias);
rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", efetuarLogin);

rotas.use(verificarUsuarioLogado); 

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", atualizarUsuario, atualizarPerfil);
rotas.post("/cliente", validaCamposCadastroCliente(schemaCliente), validaExisteEmailCpfCliente, cadastrarCliente);
rotas.get("/cliente", listarClientes);
rotas.get("/cliente/:id", validaSeClienteExiste, detalharClientes);
rotas.get("/produto/:id", detalharProduto);
rotas.delete("/produto/:id", validaExisteIdProduto, excluirProdutoPorId);
rotas.put("/produto/:id", multer.single("produto_imagem"), validaExisteIdProduto, atualizarProduto);

rotas.put("/cliente/:id", validaCamposObrigatorios(schemaAlterarCliente), validaEntradaAtualizarCliente, atualizarDadosCliente);
rotas.get('/produto', listarProdutos);
rotas.post('/produto', multer.single("produto_imagem"), cadastrarProdutos);
rotas.post('/pedido', validaCamposCadastroPedido(schemaPedido),  validaSeExisteClienteId, validaSeExisteProdutoId, validaQuantidadeProduto, cadastrarPedidos)
rotas.get('/pedido', listarPedido);

module.exports = rotas;
