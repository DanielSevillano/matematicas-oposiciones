import { formatear, obtenerProblema } from "./math.js";

let metadatos;

async function problemaSemanal() {
    const contenedor = document.querySelector("#problema-semanal");

    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), 0, 1);
    const diferencia = fecha - inicio;
    const semilla = Math.ceil(diferencia / 86400000 / 7);
    let multiplicador = 47;
    const indice = (semilla * multiplicador) % 52;

    if (!metadatos) {
        const respuesta = await fetch("data\\metadata.json");
        metadatos = await respuesta.json();
    }

    const objeto = metadatos[indice];

    const codigo = String(objeto.problema);
    const comunidad = codigo.slice(0, 2);
    const examen = codigo.slice(2, 6);
    const problema = parseInt(codigo.slice(-2));

    const articulo = await obtenerProblema(comunidad, examen, problema, false, objeto.categorias, true);
    articulo.classList.add("tarjeta");

    contenedor.append(articulo);
    formatear(articulo);
    contenedor.classList.remove("cargando");
}

async function obtenerDatos() {
    const seccion = document.querySelector("#estadisticas");

    if (!metadatos) {
        const respuesta = await fetch("data\\metadata.json");
        metadatos = await respuesta.json();
    }

    const numeroProblemas = metadatos.length;

    const tarjetaProblemas = document.createElement("div");
    tarjetaProblemas.classList.add("tarjeta");
    tarjetaProblemas.textContent = numeroProblemas + " problemas";

    const examenes = new Set();
    metadatos.forEach((objeto) => {
        examenes.add(objeto.problema.slice(0, 6));
    });

    const tarjetaExamenes = document.createElement("div");
    tarjetaExamenes.classList.add("tarjeta");
    tarjetaExamenes.textContent = examenes.size + " exámenes";

    const numeroProblemasResueltos = metadatos.filter((problema) => problema.resuelto).length;

    const tarjetaProblemasResueltos = document.createElement("div");
    tarjetaProblemasResueltos.classList.add("tarjeta");
    tarjetaProblemasResueltos.textContent = numeroProblemasResueltos + " problemas resueltos";

    seccion.append(tarjetaProblemas, tarjetaExamenes, tarjetaProblemasResueltos);
    seccion.classList.remove("cargando");
}

problemaSemanal();
obtenerDatos()