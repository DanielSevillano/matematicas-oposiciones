import { estado, mostrarCategoria } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const categoria = parametros.get("categoria");

const main = document.querySelector("main");
const botones = document.querySelectorAll(".contorno");
const botonAleatorio = document.querySelector("#aleatorio");
const cinta = document.querySelector("#cinta");
const casilla = cinta.querySelector("#casilla");

let categoriaSeleccionada;
let soloResueltos = casilla.checked;

let metadatos;
const guardarMetadatos = datos => { metadatos = datos };

function pulsar(boton) {
    if (!estado.cancelado) {
        const categoria = boton.id.replace("boton-", "");
        categoriaSeleccionada = categoria;
        mostrarCategoria(categoria, metadatos, soloResueltos, cinta, guardarMetadatos);
        cinta.classList.remove("oculto");
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?categoria=" + categoria);

        botones.forEach(b => {
            if (boton == b) b.classList.add("seleccionado");
            else b.classList.remove("seleccionado");
        });
    }
    else setTimeout(() => pulsar(boton));
}

function mostrarSoloResueltos() {
    if (!estado.cancelado) mostrarCategoria(categoriaSeleccionada, metadatos, soloResueltos, cinta, guardarMetadatos);
    else setTimeout(() => mostrarSoloResueltos(soloResueltos));
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) {
            if (main.classList.contains("cargando")) estado.cancelar();
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
    if (main.classList.contains("cargando")) estado.cancelar();
    if (categoriaSeleccionada) mostrarSoloResueltos();
})

if (categoria) {
    try {
        document.querySelector("#boton-" + categoria).click();
    }
    catch {
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname);
    }
}