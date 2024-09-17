export { estado, formatear, obtenerProblema, mostrarExamen, mostrarCategoria }

const estado = new Object({
    cancelado: false,
    reanudar: function () {
        this.cancelado = false;
    },
    cancelar: function () {
        this.cancelado = true;
    }
});

function normalizar(texto) {
    let procesado = texto.toLowerCase();
    procesado = procesado.replaceAll("á", "a");
    procesado = procesado.replaceAll("é", "e");
    procesado = procesado.replaceAll("í", "i");
    procesado = procesado.replaceAll("ó", "o");
    procesado = procesado.replaceAll("ú", "u");
    procesado = procesado.replaceAll(" ", "-");
    return procesado;
}

function formatear(elemento) {
    if (math) MathJax.typeset([elemento]);
    else setTimeout(() => formatear(elemento));
}

async function obtenerProblema(examen, problema, resuelto = false, categorias = [], tituloCompleto = false) {
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

    const contenedorCategorias = document.createElement("ul");
    contenedorCategorias.classList.add("categorias");
    categorias.forEach(categoria => {
        const elementoCategoria = document.createElement("li");
        const enlaceCategoria = document.createElement("a");
        enlaceCategoria.textContent = categoria;
        enlaceCategoria.href = "/problemas" + html + "?categoria=" + normalizar(categoria);
        enlaceCategoria.classList.add("contorno");
        elementoCategoria.append(enlaceCategoria);
        contenedorCategorias.append(elementoCategoria);
    })
    articulo.append(contenedorCategorias);

    const ruta = "data\\" + examen + problema + ".txt";

    const respuesta = await fetch(ruta);
    const datos = await respuesta.text();

    parrafo.innerHTML = datos;

    if (resuelto) {
        const contenedorResolucion = document.createElement("details");
        const tituloResolucion = document.createElement("summary");
        const textoResolucion = document.createElement("div");

        tituloResolucion.textContent = "Resolución";

        const ruta = "data\\R" + examen + problema + ".txt";
        const respuesta = await fetch(ruta);
        const datos = await respuesta.text();

        textoResolucion.innerHTML = datos;

        contenedorResolucion.append(tituloResolucion, textoResolucion);
        parrafo.append(contenedorResolucion);
    }

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

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    for (let problema = 1; problema <= 6; problema++) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        const codigo = examen * 10 + problema;
        const datosProblema = datos.find(dato => dato.problema == codigo);

        let resuelto = false;
        let categorias = [];
        if (datosProblema != undefined) {
            if (datosProblema.resuelto) resuelto = true;
            categorias = datosProblema.categorias;
        }

        boton.style.setProperty("--progreso", problema / 6 * 100);

        const seccion = await obtenerProblema(examen, problema, resuelto, categorias);
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

async function obtenerCategoria(categoria, contador = undefined) {
    const main = document.querySelector("main");

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    let problemas = datos.filter(problema => problema.categorias.map(c => normalizar(c)).includes(categoria));
    if (contador) contador.textContent = problemas.length;

    for (let problema of problemas) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        let resuelto = false
        let categorias = []
        if (problema != undefined) {
            if (problema.resuelto) resuelto = true;
            categorias = problema.categorias;
        }

        const parrafo = await obtenerProblema(parseInt(problema.problema / 10), problema.problema % 10, resuelto, categorias, true);
        main.append(parrafo);
        formatear(parrafo);
    };

    return true;
}

async function mostrarCategoria(categoria, contador = undefined) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerCategoria(categoria, contador).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}