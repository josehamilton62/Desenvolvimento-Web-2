const prompt = require("prompt-sync")();

// 1. Avaliação de Risco de Crédito
function avaliarRiscoDeCredito(rendaMensal, dividaAtual) {
  const renda = parseFloat(rendaMensal);
  const divida = parseFloat(dividaAtual);

  const TE = (divida / renda) * 100;

  if (TE < 10) {
    return "Risco Baixo";
  } else if (TE >= 10 && TE < 30) {
    return "Risco Moderado";
  } else {
    return "Risco Alto";
  }
}

console.log("=== 1. Avaliação de Risco de Crédito ===");
const valorRenda = prompt("Digite a renda mensal: ");
const valorDivida = prompt("Digite a dívida atual: ");

const risco = avaliarRiscoDeCredito(valorRenda, valorDivida);
console.log(
  `Para a renda de R$ ${valorRenda} e dívida de R$ ${valorDivida}, a classificação é: ${risco}\n`,
);

// 2. Manipulação de array com métodos de array
console.log("=== 2. Manipulação de Array ===");
const numeros = [];

while (true) {
  const entrada = prompt(
    "Digite um número para o array (ou pressione Enter vazio para finalizar): ",
  );

  if (entrada.trim() === "") {
    if (numeros.length > 0) break;
    console.log("Por favor, insira ao menos um número.");
    continue;
  }

  const num = parseFloat(entrada);
  if (!isNaN(num)) {
    numeros.push(num);
  } else {
    console.log("Valor inválido. Digite apenas números.");
  }
}

// a) Maior e menor valor do array
console.log(`a) Maior valor: ${Math.max(...numeros)}`);
console.log(`   Menor valor: ${Math.min(...numeros)}`);

// b) Novo array dobro usando map()
const dobro = numeros.map((n) => n * 2);
console.log(`b) Dobro dos valores: [${dobro.join(", ")}]`);

// c) Filtrar apenas números maiores que 5 usando filter()
const maioresQueCinco = numeros.filter((n) => n > 5);
console.log(`c) Números maiores que 5: [${maioresQueCinco.join(", ")}]\n`);

// 3. Criação e manipulação de objeto (sem classe)
console.log("=== 3. Objeto Literal (Carro) ===");
const carro = {
  marca: "Toyota",
  modelo: "Corolla",
  ano: 2022,
  exibirInfo: function () {
    console.log(
      `Marca: ${this.marca} | Modelo: ${this.modelo} | Ano: ${this.ano}`,
    );
  },
};

// a) Chamar o método exibirInfo()
carro.exibirInfo();

// b) Adicionar dinamicamente a propriedade cor com valor "Preto"
carro.cor = "Preto";

// c) Atualizar o valor de ano para 2025
carro.ano = 2025;

// d) Exibir o objeto completo no console
console.log("Objeto atualizado:", carro);
console.log("");

// 4. Orientação a Objetos (com classe e instância)
console.log("=== 4. Orientação a Objetos (Classe Livro) ===");
class Livro {
  constructor(titulo, autor, ano) {
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
  }

  detalhes() {
    console.log(
      `Livro: ${this.titulo} | Autor: ${this.autor} | Ano: ${this.ano}`,
    );
  }
}

// a) Duas instâncias da classe Livro com dados diferentes
const primeiroLivro = new Livro(
  "Use a Cabeça! JavaScript",
  "Michael Morrison",
  2008,
);
const segundoLivro = new Livro("Aprendendo Node", "Shelley Powers", 2016);

// b) Chamar o método detalhes() para ambos os livros
primeiroLivro.detalhes();
segundoLivro.detalhes();
console.log("");

// 5. Laços, condicionais e manipulação de string
console.log("=== 5. Verificação de Palíndromo ===");
const palavraInformada = prompt("Digite uma palavra: ");

// a) Quantidade de caracteres da palavra
console.log(`a) Quantidade de caracteres: ${palavraInformada.length}`);

// b) Verificar se é um palíndromo usando split(''), reverse() e join('')
const textoPadronizado = palavraInformada.trim().toLowerCase();
const textoInvertido = textoPadronizado.split("").reverse().join("");

if (textoPadronizado === textoInvertido && textoPadronizado.length > 0) {
  console.log(`b) A palavra "${palavraInformada}" é um palíndromo.`);
} else {
  console.log(`b) A palavra "${palavraInformada}" não é um palíndromo.`);
}
