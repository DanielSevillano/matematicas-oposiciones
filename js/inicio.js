import { formatear, obtenerProblema } from "./math.js";

async function problemaSemanal() {
    const contenedor = document.querySelector("#problema-semanal");

    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), 0, 1);
    const diferencia = fecha - inicio;
    const semilla = Math.ceil(diferencia / 86400000 / 7);
    let multiplicador = 61;
    const indice = (semilla * multiplicador) % 42;

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const objeto = datos[indice];
    const codigo = String(objeto.problema);
    const articulo = await obtenerProblema(codigo.slice(0, 4), codigo.slice(-1), false, objeto.categorias, true);
    articulo.classList.add("tarjeta");

    contenedor.append(articulo);
    formatear(articulo);
    contenedor.classList.remove("cargando");
}

problemaSemanal();