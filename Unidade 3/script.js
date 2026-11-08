// ---------- Constantes e seleção de elementos do DOM ----------
const URL_API = "https://picsum.photos/v2/list?limit=12";
const galeria = document.getElementById("galeria");
const mensagem = document.getElementById("mensagem");

// ---------- Requisição assíncrona para a API Picsum ----------
async function buscarFotos() {
  const resposta = await fetch(URL_API);

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}`);
  }

  const dadosFotos = await resposta.json();
  return dadosFotos;
}

// ---------- Criação dinâmica de elementos do cartão ----------
function criarCartao(itemFoto) {
  const figuraCartao = document.createElement("figure");
  figuraCartao.classList.add("cartao");

  const elementoImagem = document.createElement("img");
  elementoImagem.src = `https://picsum.photos/id/${itemFoto.id}/400/300`;
  elementoImagem.alt = `Foto de ${itemFoto.author}`;
  elementoImagem.loading = "lazy";

  const elementoLegenda = document.createElement("figcaption");
  elementoLegenda.textContent = itemFoto.author;

  figuraCartao.appendChild(elementoImagem);
  figuraCartao.appendChild(elementoLegenda);

  return figuraCartao;
}

// ---------- Carregamento da galeria e tratamento de erros ----------
async function carregarGaleria() {
  mensagem.textContent = "Carregando...";
  mensagem.classList.remove("erro");
  galeria.textContent = "";

  try {
    const listaDeFotos = await buscarFotos();

    for (const itemFoto of listaDeFotos) {
      const novoCartao = criarCartao(itemFoto);
      galeria.appendChild(novoCartao);
    }

    mensagem.textContent = `${listaDeFotos.length} fotos carregadas.`;
  } catch (erroCapturado) {
    mensagem.textContent = `Não foi possível carregar as fotos: ${erroCapturado.message}`;
    mensagem.classList.add("erro");
  }
}

// Inicializa o carregamento ao abrir a página
carregarGaleria();
