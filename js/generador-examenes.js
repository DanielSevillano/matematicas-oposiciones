import { obtenerExamenGenerado } from "./math.js";

const formulario = document.querySelector("form");
const campoNumeroProblemas = document.querySelector("#numero-problemas");
const campoComunidad = document.querySelector("#comunidad");

const boton = document.querySelector("#generar");
let metadatos;
const guardarMetadatos = datos => { metadatos = datos; };

async function procesar(event) {
    event.preventDefault();
    if (boton.disabled) return;

    boton.disabled = true;

    let comunidadSeleccionada;
    if (campoComunidad.value != "todas") comunidadSeleccionada = campoComunidad.value;
    const numeroProblemas = campoNumeroProblemas.value;

    await obtenerExamenGenerado(comunidadSeleccionada, numeroProblemas, metadatos, guardarMetadatos);
    boton.disabled = false;
}

formulario.addEventListener("submit", procesar);