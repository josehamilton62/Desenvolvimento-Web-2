// ---------- Constantes e seleção de elementos do DOM ----------
const ENDPOINT_PERSONAGENS = "https://rickandmortyapi.com/api/character";
const formPersonagem = document.getElementById("formPersonagem");
const inputIdPersonagem = document.getElementById("inputIdPersonagem");
const btnListarTodos = document.getElementById("btnListarTodos");
const btnSortear = document.getElementById("btnSortear");
const statusMensagem = document.getElementById("statusMensagem");
const gradePersonagens = document.getElementById("gradePersonagens");

// Bônus: guarda a última consulta realizada no localStorage
let ultimaUrlConsultada =
  localStorage.getItem("ultimaBuscaRickMorty") || ENDPOINT_PERSONAGENS;

// ---------- 1. Função responsável por buscar dados na API ----------
async function requisitarDadosApi(url) {
  const resposta = await fetch(url);

  if (!resposta.ok) {
    if (resposta.status === 404) {
      throw new Error(
        "Personagem não encontrado. Informe um ID válido entre 1 e 826.",
      );
    }
    throw new Error(`Erro HTTP ${resposta.status}`);
  }

  return await resposta.json();
}

// ---------- 2. Funções responsáveis por criar elementos do DOM ----------
function criarParagrafoDado(titulo, valor) {
  const p = document.createElement("p");
  p.classList.add("linha-dado");

  const negrito = document.createElement("strong");
  negrito.textContent = `${titulo}: `;

  const texto = document.createTextNode(valor);

  p.appendChild(negrito);
  p.appendChild(texto);
  return p;
}

function obterClasseStatus(statusApi) {
  if (statusApi === "Alive") return "status-alive";
  if (statusApi === "Dead") return "status-dead";
  return "status-unknown";
}

function criarCartaoPersonagem(personagem) {
  const card = document.createElement("article");
  card.classList.add("cartao-personagem");

  // 1ª Informação: Imagem do personagem
  const img = document.createElement("img");
  img.src = personagem.image;
  img.alt = `Foto de ${personagem.name}`;
  img.loading = "lazy";

  const corpo = document.createElement("div");
  corpo.classList.add("corpo-cartao");

  // 2ª Informação: Nome do personagem
  const h2 = document.createElement("h2");
  h2.classList.add("nome-personagem");
  h2.textContent = personagem.name;

  // 3ª Informação: Status (Alive, Dead ou unknown) com cor dinâmica
  const spanStatus = document.createElement("span");
  spanStatus.classList.add(
    "badge-status",
    obterClasseStatus(personagem.status),
  );
  spanStatus.textContent = `Status: ${personagem.status}`;

  // 4ª, 5ª e 6ª Informações: ID, Espécie e Origem/Localização
  const pId = criarParagrafoDado("ID", `#${personagem.id}`);
  const pEspecie = criarParagrafoDado("Espécie", personagem.species);
  const pOrigem = criarParagrafoDado("Origem", personagem.origin.name);
  const pLocal = criarParagrafoDado("Localização", personagem.location.name);

  corpo.appendChild(h2);
  corpo.appendChild(spanStatus);
  corpo.appendChild(pId);
  corpo.appendChild(pEspecie);
  corpo.appendChild(pOrigem);
  corpo.appendChild(pLocal);

  card.appendChild(img);
  card.appendChild(corpo);

  return card;
}

// ---------- 3. Função responsável por atualizar a interface ----------
function exibirErroNaPagina(mensagemErro) {
  statusMensagem.textContent = `${mensagemErro} `;
  statusMensagem.classList.add("erro");

  // Bônus: botão "Tentar de novo" quando ocorrer erro
  const botaoTentarNovamente = document.createElement("button");
  botaoTentarNovamente.type = "button";
  botaoTentarNovamente.classList.add("btn-secundario");
  botaoTentarNovamente.textContent = "Tentar de novo";
  botaoTentarNovamente.addEventListener("click", function () {
    executarConsulta(ultimaUrlConsultada);
  });

  statusMensagem.appendChild(botaoTentarNovamente);
}

async function executarConsulta(urlDestino) {
  ultimaUrlConsultada = urlDestino;
  statusMensagem.textContent = "Carregando...";
  statusMensagem.classList.remove("erro");
  gradePersonagens.textContent = "";

  try {
    const dadosRecebidos = await requisitarDadosApi(urlDestino);

    // Se a resposta tiver .results, é a lista de 20 personagens; senão, é um único personagem
    const listaPersonagens = Array.isArray(dadosRecebidos.results)
      ? dadosRecebidos.results
      : [dadosRecebidos];

    for (const item of listaPersonagens) {
      gradePersonagens.appendChild(criarCartaoPersonagem(item));
    }

    localStorage.setItem("ultimaBuscaRickMorty", urlDestino);
    statusMensagem.textContent = `${listaPersonagens.length} personagem(ns) exibido(s) na tela.`;
  } catch (erroCapturado) {
    exibirErroNaPagina(
      `Não foi possível carregar os dados: ${erroCapturado.message}`,
    );
  }
}

// ---------- 4. Controles de interação ----------
formPersonagem.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const textoId = inputIdPersonagem.value.trim();
  const numeroId = Number(textoId);

  if (textoId === "" || Number.isNaN(numeroId) || numeroId <= 0) {
    statusMensagem.textContent =
      "Informe um número de ID válido (maior que zero) para buscar.";
    statusMensagem.classList.add("erro");
    return;
  }

  executarConsulta(`${ENDPOINT_PERSONAGENS}/${numeroId}`);
});

btnListarTodos.addEventListener("click", function () {
  inputIdPersonagem.value = "";
  executarConsulta(ENDPOINT_PERSONAGENS);
});

btnSortear.addEventListener("click", function () {
  const idSorteado = Math.floor(Math.random() * 826) + 1;
  inputIdPersonagem.value = idSorteado;
  executarConsulta(`${ENDPOINT_PERSONAGENS}/${idSorteado}`);
});

// ---------- Inicialização ----------
executarConsulta(ultimaUrlConsultada);
