const express = require("express");
const app = express();
const PORTA = 3000;

// Base de dados em memória (Catálogo de Produtos)
const produtos = [
  { id: 1, nome: "Teclado mecânico", categoria: "eletronicos", preco: 250 },
  { id: 2, nome: "Mouse sem fio", categoria: "eletronicos", preco: 90 },
  { id: 3, nome: "Monitor 24 polegadas", categoria: "eletronicos", preco: 900 },
  { id: 4, nome: "Cadeira gamer", categoria: "moveis", preco: 1200 },
  { id: 5, nome: "Mesa de escritório", categoria: "moveis", preco: 650 },
  { id: 6, nome: "Livro de JavaScript", categoria: "livros", preco: 80 },
  { id: 7, nome: "Livro de Node.js", categoria: "livros", preco: 95 },
  { id: 8, nome: "Fone de ouvido", categoria: "eletronicos", preco: 150 },
];

// Middleware global para registrar horário, método e URL de cada requisição
app.use((req, res, next) => {
  const horarioAtual = new Date().toLocaleTimeString("pt-BR");
  console.log(`[${horarioAtual}] ${req.method} ${req.url}`);
  next();
});

// Rota raiz (boas-vindas)
app.get("/", (req, res) => {
  res.send("Catálogo no ar!");
});

// Rota de listagem de produtos e filtros por Query String
app.get("/produtos", (req, res) => {
  let listaFiltrada = [...produtos];

  // Filtro por categoria (Desafio 2: ignora diferença entre maiúsculas e minúsculas)
  if (req.query.categoria) {
    const categoriaBuscada = req.query.categoria.toLowerCase();
    listaFiltrada = listaFiltrada.filter(
      (item) => item.categoria.toLowerCase() === categoriaBuscada,
    );
  }

  // Filtro opcional por preço máximo (?precoMax=100)
  if (req.query.precoMax !== undefined) {
    const precoMax = parseInt(req.query.precoMax);
    if (isNaN(precoMax) || precoMax < 0) {
      return res
        .status(400)
        .json({ erro: "O preço máximo deve ser um número válido" });
    }
    listaFiltrada = listaFiltrada.filter((item) => item.preco <= precoMax);
  }

  // Ordenação opcional pelo preço (?ordem=preco)
  if (req.query.ordem === "preco") {
    listaFiltrada = [...listaFiltrada].sort((a, b) => a.preco - b.preco);
  }

  // Filtro de limite de resultados (?limite=3)
  if (req.query.limite !== undefined) {
    const limite = parseInt(req.query.limite);
    if (isNaN(limite) || limite < 1) {
      return res
        .status(400)
        .json({ erro: "O limite deve ser um número maior que zero" });
    }
    listaFiltrada = listaFiltrada.slice(0, limite);
  }

  res.json(listaFiltrada);
});

// Rota /produtos/total declarada antes de /produtos/:id
app.get("/produtos/total", (req, res) => {
  res.json({ total: produtos.length });
});

// Rota para buscar um produto específico por ID (Parâmetro de rota)
app.get("/produtos/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);

  if (isNaN(idBuscado)) {
    return res.status(400).json({ erro: "O id deve ser um número" });
  }

  const produtoEncontrado = produtos.find((item) => item.id === idBuscado);

  if (!produtoEncontrado) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  res.json(produtoEncontrado);
});

// Inicializa o servidor HTTP
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
