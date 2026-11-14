const express = require("express");
const app = express();
const PORTA = 3000;

// Array com 10 praias do Ceará (id, nome, categoria, municipio, distanciaFortalezaKm e nota)
const praias = [
  {
    id: 1,
    nome: "Praia do Futuro",
    categoria: "urbana",
    municipio: "Fortaleza",
    distanciaFortalezaKm: 10,
    nota: 9,
  },
  {
    id: 2,
    nome: "Praia de Iracema",
    categoria: "urbana",
    municipio: "Fortaleza",
    distanciaFortalezaKm: 3,
    nota: 9,
  },
  {
    id: 3,
    nome: "Canoa Quebrada",
    categoria: "litoral-leste",
    municipio: "Aracati",
    distanciaFortalezaKm: 165,
    nota: 10,
  },
  {
    id: 4,
    nome: "Jericoacoara",
    categoria: "litoral-oeste",
    municipio: "Jijoca de Jericoacoara",
    distanciaFortalezaKm: 300,
    nota: 10,
  },
  {
    id: 5,
    nome: "Morro Branco",
    categoria: "litoral-leste",
    municipio: "Beberibe",
    distanciaFortalezaKm: 85,
    nota: 9,
  },
  {
    id: 6,
    nome: "Cumbuco",
    categoria: "litoral-oeste",
    municipio: "Caucaia",
    distanciaFortalezaKm: 30,
    nota: 9,
  },
  {
    id: 7,
    nome: "Lagoinha",
    categoria: "litoral-oeste",
    municipio: "Paraipaba",
    distanciaFortalezaKm: 110,
    nota: 10,
  },
  {
    id: 8,
    nome: "Ponta Grossa",
    categoria: "litoral-leste",
    municipio: "Icapuí",
    distanciaFortalezaKm: 200,
    nota: 9,
  },
  {
    id: 9,
    nome: "Flecheiras",
    categoria: "litoral-oeste",
    municipio: "Trairi",
    distanciaFortalezaKm: 140,
    nota: 9,
  },
  {
    id: 10,
    nome: "Sabiaguaba",
    categoria: "urbana",
    municipio: "Fortaleza",
    distanciaFortalezaKm: 16,
    nota: 8,
  },
];

// Middleware global para registrar horário, método HTTP e URL no terminal
app.use((req, res, next) => {
  const horaRequisicao = new Date().toLocaleTimeString("pt-BR");
  console.log(`[${horaRequisicao}] ${req.method} ${req.url}`);
  next();
});

// Rota GET / - Mensagem de boas-vindas citando o nome da API
app.get("/", (req, res) => {
  res.send(
    "Bem-vindo à API de Praias do Ceará! Utilize a rota /praias para explorar os destinos.",
  );
});

// Rota GET /praias - Lista completa, filtros combináveis e ordenação
app.get("/praias", (req, res) => {
  let lista = [...praias];

  // Filtro por categoria (Bônus: ignora diferença entre maiúsculas e minúsculas)
  if (req.query.categoria) {
    const categoriaFiltro = req.query.categoria.toLowerCase();
    lista = lista.filter(
      (praia) => praia.categoria.toLowerCase() === categoriaFiltro,
    );
  }

  // Filtro numérico por distância máxima de Fortaleza (?distanciaMax=150)
  if (req.query.distanciaMax !== undefined) {
    const distanciaMax = parseInt(req.query.distanciaMax);
    if (isNaN(distanciaMax) || distanciaMax < 0) {
      return res.status(400).json({
        erro: "O parâmetro distanciaMax deve ser um número válido maior ou igual a zero",
      });
    }
    lista = lista.filter((praia) => praia.distanciaFortalezaKm <= distanciaMax);
  }

  // Requisito próprio: Ordenação via query string (?ordem=distancia ou ?ordem=nota)
  if (req.query.ordem === "distancia") {
    lista.sort((a, b) => a.distanciaFortalezaKm - b.distanciaFortalezaKm);
  } else if (req.query.ordem === "nota") {
    lista.sort((a, b) => b.nota - a.nota);
  }

  // Filtro numérico de limite e paginação opcional (?limite=3 ou ?pagina=2&limite=3)
  if (req.query.limite !== undefined) {
    const limite = parseInt(req.query.limite);
    if (isNaN(limite) || limite <= 0) {
      return res.status(400).json({
        erro: "O parâmetro limite deve ser um número válido maior que zero",
      });
    }

    const pagina =
      req.query.pagina !== undefined ? parseInt(req.query.pagina) : 1;
    if (isNaN(pagina) || pagina <= 0) {
      return res.status(400).json({
        erro: "O parâmetro pagina deve ser um número válido maior que zero",
      });
    }

    const inicio = (pagina - 1) * limite;
    lista = lista.slice(inicio, inicio + limite);
  }

  res.json(lista);
});

// Requisito próprio: Rota extra para consultar o total de praias
app.get("/praias/total", (req, res) => {
  res.json({ total: praias.length });
});

// Requisito próprio: Rota extra para sortear uma praia aleatória
app.get("/praias/aleatoria", (req, res) => {
  const indice = Math.floor(Math.random() * praias.length);
  res.json(praias[indice]);
});

// Rota GET /praias/:id - Busca uma praia específica pelo id
app.get("/praias/:id", (req, res) => {
  const idBuscado = parseInt(req.params.id);

  if (isNaN(idBuscado)) {
    return res.status(400).json({ erro: "O id deve ser um número válido" });
  }

  const praia = praias.find((item) => item.id === idBuscado);

  if (!praia) {
    return res.status(404).json({ erro: "Praia não encontrada" });
  }

  res.json(praia);
});

// Servidor escutando na porta 3000
app.listen(PORTA, () => {
  console.log(`API de Praias do Ceará rodando em http://localhost:${PORTA}`);
});
