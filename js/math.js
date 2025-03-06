export { estado, formatear, obtenerProblema, mostrarExamen, mostrarCategoria };

const estado = new Object({
    cancelado: false,
    reanudar: function () {
        this.cancelado = false;
    },
    cancelar: function () {
        this.cancelado = true;
    }
});

const comunidades = new Map([
    ["AN", "Andalucía"],
    ["AR", "Aragón"],
    ["AS", "Asturias"],
    ["CA", "Cantabria"],
    ["CM", "Castilla la Mancha"],
    ["CL", "Castilla y León"],
    ["CT", "Cataluña"],
    ["CE", "Ceuta"],
    ["EX", "Extremadura"],
    ["GA", "Galicia"],
    ["IB", "Islas Baleares"],
    ["LR", "La Rioja"],
    ["MA", "Madrid"],
    ["ME", "Melilla"],
    ["MU", "Murcia"],
    ["NA", "Navarra"],
    ["PV", "País Vasco"],
    ["VA", "Valencia"]
]);

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

async function obtenerProblema(comunidad, examen, problema, resuelto = false, categorias = [], tituloCompleto = false, mapaProblemas = undefined) {
    const articulo = document.createElement("article");
    const titulo = document.createElement("h3");
    const parrafo = document.createElement("p");

    let html = "";
    if (location.href.includes(".html")) html = ".html";

    if (tituloCompleto) {
        titulo.textContent = "Problema " + problema + ": ";

        const enlace = document.createElement("a");
        enlace.textContent = "Examen de " + examen + " de " + comunidades.get(comunidad);
        enlace.href = "/examenes" + html + "?examen=" + comunidad + examen;

        titulo.append(enlace);
    } else titulo.textContent = "Problema " + problema;

    articulo.append(titulo);

    if (categorias.length > 0) {
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
        });
        articulo.append(contenedorCategorias);
    }

    const carpeta = normalizar(comunidades.get(comunidad));

    let numeracion = String(problema);
    if (problema < 10) numeracion = String(0) + String(problema);
    const codigo = comunidad + String(examen) + numeracion;

    let datos;
    if (!mapaProblemas || !mapaProblemas.get(codigo)) {
        const ruta = "data\\problemas\\" + carpeta + "\\" + codigo + ".txt";
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
            const ruta = "data\\problemas\\" + carpeta + "\\" + codigoResolucion + ".txt";
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

    const comunidad = examen.slice(0, 2);
    const curso = examen.slice(-4);

    const titulo = document.createElement("h2");
    titulo.innerText = "📋 Examen de " + curso + " de " + comunidades.get(comunidad);

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.classList.add("cargando");
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.append(titulo);

    const metadatosFiltrados = metadatos.filter(dato => dato.problema.startsWith(examen));
    const problemas = metadatosFiltrados.length;

    for (let problema = 1; problema <= problemas; problema++) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        let codigo = examen + problema;
        if (problema < 10) codigo = examen + "0" + problema;
        const datosProblema = metadatos.find(dato => dato.problema == codigo);

        let resuelto = false;
        let categorias = [];
        if (datosProblema != undefined) {
            if (datosProblema.resuelto) resuelto = true;
            categorias = datosProblema.categorias;
        }

        boton.style.setProperty("--progreso", problema / problemas * 100);

        const seccion = await obtenerProblema(comunidad, curso, problema, resuelto, categorias);
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

    let problemas = metadatos.filter(problema => problema.categorias && problema.categorias.map(c => normalizar(c)).includes(categoria));
    if (soloResueltos) problemas = problemas.filter(problema => problema.resuelto);
    const total = problemas.length;

    cinta.querySelector("#contador").textContent = total;
    cinta.classList.add("cargando");
    let contador = 0;

    for (let objeto of problemas) {
        if (estado.cancelado) {
            estado.reanudar();
            return false;
        }

        let resuelto = false;
        let categorias = [];
        if (objeto != undefined) {
            if (objeto.resuelto) resuelto = true;
            categorias = objeto.categorias;
        }

        contador++;
        cinta.style.setProperty("--progreso", contador / total * 100);

        const comunidad = objeto.problema.slice(0, 2);
        const examen = objeto.problema.slice(2, 6);
        const problema = parseInt(objeto.problema.slice(-2));

        const parrafo = await obtenerProblema(comunidad, examen, problema, resuelto, categorias, true, mapaProblemas);
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