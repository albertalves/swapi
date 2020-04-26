// Declaração de Variáveis Globais
let urlPersonagensSorteados = [];
let pesoPersonagens = [];
let nomePersonagens = [];
let totalPesoPersonagens;
let pesoHanSolo;
let capacidadeNave;
let urlNave = "https://swapi.dev/api/starships/10/";
let urlHanSolo = "https://swapi.dev/api/people/14/";
let urlFilme = "https://swapi.dev/api/films/1/";

//Ao carregar a pagina executar as funções
$(document).ready(function () {
    mascaraPeso();
    contultarApi(urlNave, "urlNave");
    contultarApi(urlHanSolo, "urlHanSolo");
});

// Executada ao submeter o formulário
function iniciarViagem() {
    //Se os campos não foram validados, paramos a execução do método.
    if (!validarCampos())
        return

    contultarApi(urlFilme, "urlFilme");
}

// Método que consulta a api através de determinado endpoint.
function contultarApi(url, text) {
    fetch(url)
        .then(response => response.json())
        .then(response => {
            return armazenarDados(text, response)
        })
}

// Armazena as respostas das constulas
function armazenarDados(text, response) {
    switch (text) {
        case "urlNave":
            capacidadeNave = parseInt(response.cargo_capacity);
            break;
        case "urlHanSolo":
            pesoHanSolo = response.mass;
            break;
        case "urlFilme":
            retornarPersonagensAleatorios(response.characters);
            break;
    }
}

// Retorna 5 personagens aleatórios.
function retornarPersonagensAleatorios(personagens) {

    //removendo o han solo pois ele já está na nave como piloto
    personagens.splice(12, 1);

    for (let i = 1; i <= 5; i++) {
        // Retorna a quantidade de elementros do array
        let max = personagens.length;
        //Retorna um número aleatório entre 0 e o tamanho máximo do array
        let numAleatorio = Math.floor(Math.random() * max);
        //Pegando o personagem sorteado
        urlPersonagensSorteados.push(personagens[numAleatorio]);
        //Removendo o personagem para não causar duplicidade
        personagens.splice(numAleatorio, 1);
    }

    retornarPesoPersonagensSorteados(urlPersonagensSorteados);
}

// Retorna o peso dos personagens sorteados
function retornarPesoPersonagensSorteados() {
    // Para cada personagem eu faço uma consulta na api
    urlPersonagensSorteados.forEach(function (personagem) {
        fetch(personagem)
            .then(response => response.json())
            .then(response => {
                // inserindo o PESO de cada personagem ao array
                pesoPersonagens.push(parseInt(response.mass));
                // inserindo o NOME de cada personagem ao array
                nomePersonagens.push(response.name);

                if (pesoPersonagens.length === 5)
                    calcularTotal();
            })
    });
}

// Calcula o peso dos personagens sorteados
function calcularTotal() {
    // pegando o peso digitado
    let pesoDigitado = $('#peso').val();
    //Somando o peso do HanSolo ao peso digitado
    totalPesoPersonagens = parseInt(pesoHanSolo) + parseInt(pesoDigitado);

    pesoPersonagens.forEach(item => {
        // Alguns personagens não retornam peso, então eu verifico antes de somar.
        if (!isNaN(item))
            totalPesoPersonagens += item;
    });

    exibirMensagem();
}

// Função que exibe a mensagem na tela
function exibirMensagem() {
    let nomePax = $('#name').val();

    if (totalPesoPersonagens <= capacidadeNave) {
        let htmlWelcome = '';
        let htmlViajantes = '';

        htmlWelcome = 'Han Solo diz: Bem vindo à bordo, ' + nomePax + '!';
        htmlViajantes = "Os viajantes são: ";
        for (let i = 0; i < nomePersonagens.length; i++) {
            switch (i) {
                case 3:
                    htmlViajantes += nomePersonagens[i] + " e ";
                    break;
                case 4:
                    htmlViajantes += nomePersonagens[i] + ".";
                    break;
                default:
                    htmlViajantes += nomePersonagens[i] + ", ";
                    break;
            }
        }

        $('.welcome').html(htmlWelcome);
        $('.viajantes').html(htmlViajantes);

        $('.falcon').fadeIn(700);
        $('.texto').fadeIn(500);
    }
    else {
        $('.falcon').hide();
        $('.welcome').hide();
        $('.viajantes').hide();
        $('.capacidadeAtingida').html("Han Solo diz: A capacidade máxima foi atingida");
    }
    // Após exibir a mensagem, limpar os dados para um nova consulta.
    limparDados();
}

function limparDados() {
    urlPersonagensSorteados = [];
    pesoPersonagens = [];
    nomePersonagens = [];
    totalPesoPersonagens = null;
}
// Máscara de peso
function mascaraPeso() {
    $('#peso').maskWeight({
        integerDigits: 6, // número de dígitos inteiros
        decimalDigits: 2, // número de decimais
        decimalMark: ',' // separador
    });
}

// Função simples para validar os campos do formulário.
// OBS: Sei da existência do plugin Validation mas quis desenvolver tudo manualmente.
function validarCampos() {
    let inputName = $('#name');
    let inputPeso = $('#peso');
    let bool = true;

    if (inputName.val() === "") {
        $('.msgValidaPax').show();
        inputName.addClass('borderRed');
        bool = false;
    }
    else {
        $('.msgValidaPax').hide();
        inputName.removeClass('borderRed');
    }

    if (inputPeso.val() === "0,00") {
        $('.msgValidaPeso').show();
        inputPeso.addClass('borderRed');
        bool = false;
    }
    else {
        $('.msgValidaPeso').hide();
        inputPeso.removeClass('borderRed');
    }

    return bool;
}
