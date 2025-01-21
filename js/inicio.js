import { formatear, obtenerProblema } from "./math.js";

async function problemaSemanal() {
    const contenedor = document.querySelector("#problema-semanal");

    const fecha = new Date();
    const inicio = new Date(fecha.getFullYear(), 0, 1);
    const diferencia = fecha - inicio;
    const semilla = Math.ceil(diferencia / 86400000 / 7);
    let multiplicador = 47;
    const indice = (semilla * multiplicador) % 52;

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const objeto = datos[indice];

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

problemaSemanal();