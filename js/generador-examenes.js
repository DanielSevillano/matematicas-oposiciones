import { formatear, obtenerProblema } from "./math.js";

const formulario = document.querySelector("form");

const intervalo1 = document.querySelector("#curso-inicial");
const intervalo2 = document.querySelector("#curso-final");

async function obtenerExamenGenerado(problemas) {
    const main = document.querySelector("main");

    const titulo = document.createElement("h2");
    titulo.innerText = "📋 Examen generado";

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

    for (let numero = 1; numero <= 6; numero++) {
        const problema = problemas[numero - 1];

        let resuelto = false;
        let categorias = []
        if (problema != undefined) {
            if (problema.resuelto) resuelto = true;
            categorias = problema.categorias;
        }

        boton.style.setProperty("--progreso", numero / 8 * 100);

        const seccion = await obtenerProblema(parseInt(problema.problema / 10), problema.problema % 10, resuelto, categorias, true);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");
}

async function mostrarExamenGenerado(problemas) {
    const main = document.querySelector("main");
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

    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    const boton = document.querySelector("#generar");
    boton.disabled = true;

    const cursoInicial = Math.max(parseInt(intervalo1.value), parseInt(intervalo2.value));
    const cursoFinal = Math.min(parseInt(intervalo1.value), parseInt(intervalo2.value));

    const respuesta = await fetch("data\\metadata.json");
    const data = await respuesta.json();

    const datos = data.filter(problema => {
        const curso = parseInt(problema.problema / 10);
        return curso >= cursoFinal && curso <= cursoInicial;
    });

    if (datos.length == 0) {
        main.classList.remove("cargando");
        boton.disabled = false;
        return;
    };

    const problema1 = problemaAleatorio(datos);
    const problema2 = problemaAleatorio(datos, [problema1]);
    const problema3 = problemaAleatorio(datos, [problema1, problema2]);
    const problema4 = problemaAleatorio(datos, [problema1, problema2, problema3]);
    const problema5 = problemaAleatorio(datos, [problema1, problema2, problema3, problema4]);
    const problema6 = problemaAleatorio(datos, [problema1, problema2, problema3, problema4, problema5]);

    mostrarExamenGenerado([problema1, problema2, problema3, problema4, problema5, problema6]);
}

formulario.addEventListener("submit", procesar);