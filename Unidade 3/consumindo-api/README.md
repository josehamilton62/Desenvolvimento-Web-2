# Catálogo de Personagens - Rick and Morty API

## API Escolhida

- **Nome da API:** Rick and Morty API
- **Link da documentação:** https://rickandmortyapi.com/documentation
- **Endpoints utilizados:**
  - Lista de personagens: `https://rickandmortyapi.com/api/character`
  - Personagem específico por ID: `https://rickandmortyapi.com/api/character/{id}`

## O que a página faz

A página consome dados públicos da série Rick and Morty utilizando `fetch`, `async`/`await` e manipulação do DOM com `createElement` e `textContent`.

- Ao abrir, mostra `"Carregando..."` e renderiza os cartões dos personagens (ou recupera a última busca salva no `localStorage`).
- Exibe 6 informações de cada personagem: foto (`image`), nome (`name`), status com cor indicativa para _Alive_, _Dead_ ou _unknown_ (`status`), número de identificação (`id`), espécie (`species`), origem (`origin.name`) e localização (`location.name`).
- Possui controles interativos para buscar um personagem específico pelo seu ID, sortear um personagem aleatório ou recarregar a galeria completa.
- Trata entradas inválidas, IDs inexistentes (erro 404) e falhas de conexão diretamente na página, oferecendo um botão `"Tentar de novo"`.

## Como abrir a página

1. Faça o download ou clone este repositório.
2. Acesse a pasta `Unidade 3/consumindo-api`.
3. Abra o arquivo `index.html` em qualquer navegador web moderno (ou pelo **Live Server** do VS Code).
