// ---------- Constantes e seleção de elementos do DOM (R12) ----------
const formGasto = document.getElementById("formGasto");
const inputDescricao = document.getElementById("descricao");
const inputValor = document.getElementById("valor");
const selectCategoria = document.getElementById("categoria");
const paragrafoMensagem = document.getElementById("mensagem");
const elementoTotalGeral = document.getElementById("totalGeral");
const paragrafoVazio = document.getElementById("vazio");
const corpoTabelaGastos = document.getElementById("listaGastos");

// Elementos da seção Bônus (B1 e B2)
const inputOrcamento = document.getElementById("orcamento");
const paragrafoAvisoOrcamento = document.getElementById("avisoOrcamento");
const selectFiltroCategoria = document.getElementById("filtroCategoria");
const containerTotalGeral = elementoTotalGeral.parentElement;

// Mapa de nomes das categorias com acentuação (R4)
const rotulosCategorias = {
  alimentacao: "Alimentação",
  transporte: "Transporte",
  lazer: "Lazer",
  estudos: "Estudos",
  outros: "Outros",
};

// ---------- Estado da aplicação e localStorage (R10 e B1) ----------
let listaDeGastos = JSON.parse(localStorage.getItem("gastos")) ?? [];
let orcamentoMensal = Number(localStorage.getItem("orcamento")) || 0;

// ---------- Funções auxiliares ----------
function formatarMoeda(valorNumerico) {
  return valorNumerico.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function exibirFeedback(texto, classeTipo) {
  paragrafoMensagem.textContent = texto;
  paragrafoMensagem.classList.remove("erro", "sucesso");
  if (classeTipo) {
    paragrafoMensagem.classList.add(classeTipo);
  }
}

function salvarDadosNoNavegador() {
  localStorage.setItem("gastos", JSON.stringify(listaDeGastos));
}

function validarCampos(descricao, valorTexto, categoria) {
  if (descricao === "") {
    return "Por favor, preencha a descrição do gasto.";
  }
  if (valorTexto === "" || Number.isNaN(Number(valorTexto))) {
    return "Por favor, informe um valor numérico válido.";
  }
  if (Number(valorTexto) <= 0) {
    return "O valor do gasto deve ser maior que zero.";
  }
  if (categoria === "") {
    return "Por favor, selecione uma categoria para o gasto.";
  }
  return "";
}

// ---------- Criação de elementos e atualização da tela ----------
function montarLinhaTabela(itemGasto) {
  const linha = document.createElement("tr");
  linha.dataset.id = itemGasto.id;

  // 1. Célula de descrição
  const celulaDescricao = document.createElement("td");
  celulaDescricao.textContent = itemGasto.descricao;

  // 2. Célula de categoria com badge
  const celulaCategoria = document.createElement("td");
  const spanBadge = document.createElement("span");
  spanBadge.classList.add("badge", itemGasto.categoria);
  spanBadge.textContent = rotulosCategorias[itemGasto.categoria];
  celulaCategoria.appendChild(spanBadge);

  // 3. Célula de valor formatado
  const celulaValor = document.createElement("td");
  celulaValor.classList.add("valor");
  celulaValor.textContent = formatarMoeda(itemGasto.valor);

  // 4. Célula com botão Remover
  const celulaAcao = document.createElement("td");
  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.classList.add("remover");
  botaoRemover.textContent = "Remover";
  celulaAcao.appendChild(botaoRemover);

  linha.appendChild(celulaDescricao);
  linha.appendChild(celulaCategoria);
  linha.appendChild(celulaValor);
  linha.appendChild(celulaAcao);

  return linha;
}

function calcularEAtualizarTotais() {
  const somaPorCategoria = {
    alimentacao: 0,
    transporte: 0,
    lazer: 0,
    estudos: 0,
    outros: 0,
  };

  let somaGeral = 0;

  for (const item of listaDeGastos) {
    somaPorCategoria[item.categoria] += item.valor;
    somaGeral += item.valor;
  }

  // Atualiza Total Geral (R6)
  elementoTotalGeral.textContent = formatarMoeda(somaGeral);

  // Atualiza Total de cada categoria (R7)
  for (const chaveCategoria in somaPorCategoria) {
    const elementoCategoria = document.getElementById(
      "total-" + chaveCategoria,
    );
    elementoCategoria.textContent = formatarMoeda(
      somaPorCategoria[chaveCategoria],
    );
  }

  // Verifica orçamento mensal (Bônus B1)
  if (orcamentoMensal > 0 && somaGeral > orcamentoMensal) {
    const excesso = somaGeral - orcamentoMensal;
    containerTotalGeral.classList.add("estourou");
    paragrafoAvisoOrcamento.textContent = `Orçamento ultrapassado em ${formatarMoeda(excesso)}.`;
  } else {
    containerTotalGeral.classList.remove("estourou");
    paragrafoAvisoOrcamento.textContent = "";
  }
}

function desenharTela() {
  corpoTabelaGastos.textContent = "";

  const categoriaFiltrada = selectFiltroCategoria.value;

  for (const item of listaDeGastos) {
    if (categoriaFiltrada === "" || item.categoria === categoriaFiltrada) {
      corpoTabelaGastos.appendChild(montarLinhaTabela(item));
    }
  }

  // Controla a exibição da mensagem de lista vazia (R9 e B2)
  const possuiLinhasVisiveis = corpoTabelaGastos.children.length > 0;
  paragrafoVazio.classList.toggle("oculto", possuiLinhasVisiveis);

  calcularEAtualizarTotais();
}

// ---------- Manipulação de Eventos ----------
formGasto.addEventListener("submit", function (evento) {
  evento.preventDefault(); // R1: impede o recarregamento da página

  const descricaoLimpa = inputDescricao.value.trim();
  const valorDigitado = inputValor.value.trim();
  const categoriaEscolhida = selectCategoria.value;

  const erroValidacao = validarCampos(
    descricaoLimpa,
    valorDigitado,
    categoriaEscolhida,
  );

  if (erroValidacao !== "") {
    exibirFeedback(erroValidacao, "erro"); // R2
    return;
  }

  const valorArredondado = Math.round(Number(valorDigitado) * 100) / 100;

  listaDeGastos.push({
    id: Date.now(),
    descricao: descricaoLimpa,
    valor: valorArredondado,
    categoria: categoriaEscolhida,
  });

  salvarDadosNoNavegador(); // R10
  desenharTela(); // R4, R5, R6, R7, R9
  formGasto.reset(); // R11
  inputDescricao.focus(); // R11
  exibirFeedback("Gasto adicionado com sucesso!", "sucesso"); // R3
});

// Delegação de evento para remover gasto (R8)
corpoTabelaGastos.addEventListener("click", function (evento) {
  const botaoClicado = evento.target.closest(".remover");
  if (!botaoClicado) {
    return;
  }

  const linhaAlvo = botaoClicado.closest("tr");
  const idParaRemover = Number(linhaAlvo.dataset.id);

  listaDeGastos = listaDeGastos.filter(function (item) {
    return item.id !== idParaRemover;
  });

  salvarDadosNoNavegador();
  desenharTela();
});

// Evento de filtro por categoria (Bônus B2)
selectFiltroCategoria.addEventListener("change", desenharTela);

// Evento de orçamento mensal (Bônus B1)
inputOrcamento.addEventListener("input", function () {
  orcamentoMensal = Number(inputOrcamento.value) || 0;
  localStorage.setItem("orcamento", orcamentoMensal);
  calcularEAtualizarTotais();
});

// ---------- Inicialização ao carregar a página ----------
if (orcamentoMensal > 0) {
  inputOrcamento.value = orcamentoMensal;
}
desenharTela();
