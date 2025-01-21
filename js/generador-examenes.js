import { formatear, obtenerProblema } from "./math.js";

const main = document.querySelector("main");
const formulario = document.querySelector("form");
const intervalo1 = document.querySelector("#curso-inicial");
const intervalo2 = document.querySelector("#curso-final");

const numeroProblemas = 6;
let metadatos;

async function obtenerExamenGenerado(problemas) {
    const titulo = document.createElement("h2");
    titulo.innerText = "📋 Examen generado";

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

    for (let numero = 1; numero <= numeroProblemas; numero++) {
        const objeto = problemas[numero - 1];

        let resuelto = false;
        let categorias = []
        if (objeto != undefined) {
            if (objeto.resuelto) resuelto = true;
            categorias = objeto.categorias;
        }

        boton.style.setProperty("--progreso", numero / numeroProblemas * 100);

        const comunidad = objeto.problema.slice(0, 2);
        const examen = objeto.problema.slice(2, 6);
        const problema = parseInt(objeto.problema.slice(-2));

        const seccion = await obtenerProblema(comunidad, examen, problema, resuelto, categorias, true);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");
}

async function mostrarExamenGenerado(problemas) {
    const boton = document.querySelector("#generar");

    obtenerExamenGenerado(problemas).then(() => {
        main.classList.remove("cargando");
        boton.disabled = false;
    });
}

function problemaAleatorio(problemas, excepciones = []) {
    let aleatorio = problemas[Math.floor(Math.random() * problemas.length)];
    while (excepciones.includes(aleatorio)) aleatorio = problemas[Math.floor(Math.random() * problemas.length)];

    return aleatorio;
}

async function procesar(event) {
    event.preventDefault();

    main.textContent = "";
    main.classList.add("cargando");

    const boton = document.querySelector("#generar");
    boton.disabled = true;

    const cursoInicial = Math.max(parseInt(intervalo1.value), parseInt(intervalo2.value));
    const cursoFinal = Math.min(parseInt(intervalo1.value), parseInt(intervalo2.value));

    if (!metadatos) {
        const respuesta = await fetch("data\\metadata.json");
        metadatos = await respuesta.json();
    }

    const datos = metadatos.filter(objeto => {
        const curso = objeto.problema.slice(2, 6);
        return curso >= cursoFinal && curso <= cursoInicial;
    });

    if (datos.length == 0) {
        main.classList.remove("cargando");
        boton.disabled = false;
        return;
    };

    let problemas = [];
    for (let i = 1; i <= numeroProblemas; i++) {
        problemas.push(problemaAleatorio(datos, problemas));
    }

    mostrarExamenGenerado(problemas);
}

formulario.addEventListener("submit", procesar);