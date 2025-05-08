import { obtenerCategoria } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const categoria = parametros.get("categoria");

const main = document.querySelector("main");
const botones = document.querySelectorAll(".contorno");
const botonAleatorio = document.querySelector("#aleatorio");
const cinta = document.querySelector("#cinta");
const casilla = cinta.querySelector("#casilla");
const contador = cinta.querySelector("#contador");

let categoriaSeleccionada;
let soloResueltos = casilla.checked;
if (soloResueltos) main.classList.add("resueltos");

let metadatos;
const guardarMetadatos = datos => { metadatos = datos; };

function pulsar(boton) {
    const categoria = boton.id.replace("boton-", "");
    categoriaSeleccionada = categoria;
    obtenerCategoria(categoria, metadatos, contador, soloResueltos, guardarMetadatos);
    cinta.classList.remove("oculto");
    history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?categoria=" + categoria);

    botones.forEach(b => {
        if (boton == b) b.classList.add("seleccionado");
        else b.classList.remove("seleccionado");
    });
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) {
            pulsar(boton);
        }
    });
});

botonAleatorio.addEventListener("click", () => {
    const boton = botones[Math.floor(Math.random() * botones.length)];
    boton.click();
});

casilla.addEventListener("click", () => {
    soloResueltos = casilla.checked;
    if (soloResueltos) {
        main.classList.add("resueltos");
        contador.textContent = main.querySelectorAll(".resuelto").length;
    }
    else {
        main.classList.remove("resueltos");
        contador.textContent = main.querySelectorAll("article").length;
    }
});

if (categoria) {
    try {
        document.querySelector("#boton-" + categoria).click();
    }
    catch {
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname);
    }
}