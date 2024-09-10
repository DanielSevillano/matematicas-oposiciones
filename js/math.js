export { estado, formatear, obtenerProblema, mostrarExamen }

const estado = new Object({
    cancelado: false,
    reanudar: function () {
        this.cancelado = false;
    },
    cancelar: function () {
        this.cancelado = true;
    }
});

function formatear(elemento) {
    if (math) MathJax.typeset([elemento]);
    else setTimeout(() => formatear(elemento));
}

async function obtenerProblema(examen, problema, tituloCompleto = false) {
    const articulo = document.createElement("article");
    const titulo = document.createElement("h3");
    const parrafo = document.createElement("p");

    let html = "";
    if (location.href.includes(".html")) html = ".html";

    if (tituloCompleto) {
        titulo.textContent = "Problema " + problema + ": ";

        const enlace = document.createElement("a");
        enlace.textContent = "Examen de " + examen;
        enlace.href = "/examenes" + html + "?examen=" + examen;

        titulo.append(enlace);
    } else titulo.textContent = "Problema " + problema;

    articulo.append(titulo);

    const ruta = "data\\" + examen + problema + ".txt";

    const respuesta = await fetch(ruta);
    const datos = await respuesta.text();

    parrafo.innerHTML = datos;

    articulo.append(parrafo);

    return articulo;
}

async function obtenerExamen(examen) {
    const main = document.querySelector("main");

    const titulo = document.createElement("h2");
    titulo.innerText = "📋 Examen de " + examen;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

    for (let problema = 1; problema <= 6; problema++) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        boton.style.setProperty("--progreso", problema / 6 * 100);

        const seccion = await obtenerProblema(examen, problema);
        main.append(seccion);
        formatear(seccion);
    }

    boton.disabled = false;
    boton.classList.remove("cargando");

    return true;
}

async function mostrarExamen(examen) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerExamen(examen).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}