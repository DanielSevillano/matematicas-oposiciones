const formulario = document.querySelector("form");
const bolas = document.querySelector("#bolas");
const resultados = document.querySelector("#resultados");
let temario;

function numeroAleatorio(excepciones = []) {
    let numero = Math.floor(Math.random() * 71);
    while (excepciones.includes(numero)) numero = Math.floor(Math.random() * 71);
    return numero;
}

async function sortear(event) {
    event.preventDefault();
    resultados.textContent = "";
    resultados.classList.add("cargando");

    if (!temario) {
        const respuesta = await fetch("data\\temario.json");
        temario = await respuesta.json();
    }

    const lista = document.createElement("ol");
    resultados.append(lista);

    let numeros = [];
    for (let i = 1; i <= parseInt(bolas.value); i++) numeros.push(numeroAleatorio(numeros));
    numeros.sort((a, b) => a - b).forEach((numero) => {
        const elemento = document.createElement("li");
        elemento.textContent = temario[numero];
        elemento.value = numero + 1;
        lista.append(elemento);
    });

    resultados.classList.remove("cargando");
}

formulario.addEventListener("submit", sortear);