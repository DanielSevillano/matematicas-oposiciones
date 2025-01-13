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

async function obtenerProblema(examen, problema, resuelto = false, categorias = [], tituloCompleto = false, mapaProblemas = undefined) {
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

    const codigo = String(examen) + String(problema);

    let datos;
    if (!mapaProblemas || !mapaProblemas.get(codigo)) {
        const ruta = "data\\problemas\\" + codigo + ".txt";
        const respuesta = await fetch(ruta);
        datos = await respuesta.text();
        if (mapaProblemas) mapaProblemas.set(codigo, datos);
    } else {
        datos = mapaProblemas.get(codigo);
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    parrafo.innerHTML = datos;

    if (resuelto) {
        const contenedorResolucion = document.createElement("details");
        const tituloResolucion = document.createElement("summary");
        const textoResolucion = document.createElement("div");

        tituloResolucion.textContent = "Resolución";

        const codigoResolucion = "R" + codigo;

        if (!mapaProblemas || !mapaProblemas.get(codigoResolucion)) {
            const ruta = "data\\problemas\\" + codigoResolucion + ".txt";
            const respuesta = await fetch(ruta);
            datos = await respuesta.text();
            if (mapaProblemas) mapaProblemas.set(codigoResolucion, datos);
        } else {
            datos = mapaProblemas.get(codigoResolucion);
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        textoResolucion.innerHTML = datos;

        contenedorResolucion.append(tituloResolucion, textoResolucion);
        parrafo.append(contenedorResolucion);
    }

    articulo.append(parrafo);

    return articulo;
}

async function obtenerExamen(examen, metadatos) {
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

        const codigo = examen * 10 + problema;
        const datosProblema = metadatos.find(dato => dato.problema == codigo);

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

async function mostrarExamen(examen, metadatos, guardarMetadatos) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    let datos;
    if (!metadatos) {
        const respuesta = await fetch("data\\metadata.json");
        datos = await respuesta.json();
        guardarMetadatos(datos);
    } else datos = metadatos;

    obtenerExamen(examen, datos).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}

async function obtenerCategoria(categoria, metadatos, mapaProblemas, soloResueltos, cinta) {
    const main = document.querySelector("main");

    let problemas = metadatos.filter(problema => problema.categorias.map(c => normalizar(c)).includes(categoria));
    if (soloResueltos) problemas = problemas.filter(problema => problema.resuelto);
    const total = problemas.length;

    cinta.querySelector("#contador").textContent = total;
    cinta.classList.add("cargando");
    let contador = 0;

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

        contador++;
        cinta.style.setProperty("--progreso", contador / total * 100);

        const parrafo = await obtenerProblema(parseInt(problema.problema / 10), problema.problema % 10, resuelto, categorias, true, mapaProblemas);
        main.append(parrafo);
        formatear(parrafo);
    };

    cinta.classList.remove("cargando");

    return true;
}

async function mostrarCategoria(categoria, metadatos, mapaProblemas, soloResueltos, cinta, guardarMetadatos) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    let datos;
    if (!metadatos) {
        const respuesta = await fetch("data\\metadata.json");
        datos = await respuesta.json();
        guardarMetadatos(datos);
    } else datos = metadatos;

    obtenerCategoria(categoria, datos, mapaProblemas, soloResueltos, cinta).then(() => {
        main.classList.remove("cargando");
        estado.reanudar();
    });
}