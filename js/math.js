export { Problema, obtenerProblema, obtenerExamen, obtenerCategoria, obtenerExamenGenerado };

const main = document.querySelector("main");
let html = "";
if (location.href.includes(".html")) html = ".html";

let controlador = new AbortController();
let indicacion = controlador.signal;

async function formatear(elemento) {
    if (math) return window.MathJax.typesetPromise([elemento]);
    else setTimeout(() => formatear(elemento));
}

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
    ["IC", "Islas Canarias"],
    ["LR", "La Rioja"],
    ["MA", "Madrid"],
    ["ME", "Melilla"],
    ["MU", "Murcia"],
    ["NA", "Navarra"],
    ["PV", "País Vasco"],
    ["VA", "Valencia"]
]);

class Problema {
    constructor(codigo, resuelto = false, categorias = []) {
        this.idComunidad = codigo.slice(0, 2);
        this.curso = parseInt(codigo.slice(2, 6));
        this.numero = parseInt(codigo.slice(-2));
        this.resuelto = resuelto;
        this.categorias = categorias;
    }

    codigo() {
        let numeracion = String(this.numero);
        if (this.numero < 10) numeracion = String(0) + numeracion;
        return this.idComunidad + String(this.curso) + numeracion;
    }

    comunidad() {
        return comunidades.get(this.idComunidad);
    }
}

function tituloProblema(problema, tituloCompleto) {
    const titulo = document.createElement("h3");

    if (tituloCompleto) {
        titulo.textContent = "Problema " + problema.numero + ": ";
        const enlace = document.createElement("a");
        enlace.textContent = "Examen de " + problema.curso + " de " + problema.comunidad();
        enlace.href = "/examenes" + html + "?examen=" + problema.idComunidad + problema.curso;
        titulo.append(enlace);
    } else titulo.textContent = "Problema " + problema.numero;

    return titulo;
}

function categoriasProblema(categorias) {
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

    return contenedorCategorias;
}

function encabezadoExamen(titulo) {
    const encabezado = document.createElement("h2");
    encabezado.innerText = "📋 " + titulo;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.disabled = true;
    boton.addEventListener("click", () => window.print());
    encabezado.append(boton);

    return { encabezado, boton };
}

async function descargarMetadatos(metadatos, guardarMetadatos) {
    let datos;
    if (!metadatos) {
        const respuesta = await fetch("data\\metadata.json");
        datos = await respuesta.json();
        guardarMetadatos(datos);
    } else datos = metadatos;

    return datos;
}

async function obtenerProblema(articulo, problema, tituloCompleto = false, prioridad = "auto") {
    articulo.append(tituloProblema(problema, tituloCompleto));
    if (problema.resuelto) articulo.classList.add("resuelto");
    if (problema.categorias.length > 0) articulo.append(categoriasProblema(problema.categorias));

    const contenido = document.createElement("div");
    contenido.classList.add("cargando");
    articulo.append(contenido);

    const parrafo = document.createElement("p");
    const carpeta = normalizar(problema.comunidad());

    const ruta = "data\\problemas\\" + carpeta + "\\" + problema.codigo() + ".txt";
    const respuesta = await fetch(ruta, {
        priority: prioridad,
        signal: indicacion
    });
    const datos = await respuesta.text();
    parrafo.innerHTML = datos;
    contenido.append(parrafo);
    await formatear(parrafo);
    contenido.classList.remove("cargando");

    if (problema.resuelto) {
        const contenedorResolucion = document.createElement("details");
        const tituloResolucion = document.createElement("summary");
        tituloResolucion.textContent = "Resolución";
        contenedorResolucion.append(tituloResolucion);
        articulo.append(contenedorResolucion);

        const textoResolucion = document.createElement("div");
        textoResolucion.classList.add("cargando");

        const codigoResolucion = "R" + problema.codigo();
        const rutaResolucion = "data\\problemas\\" + carpeta + "\\" + codigoResolucion + ".txt";
        const respuestaResolucion = await fetch(rutaResolucion, {
            priority: "low",
            signal: indicacion
        });
        const datosResolucion = await respuestaResolucion.text();
        textoResolucion.innerHTML = datosResolucion;

        contenedorResolucion.append(textoResolucion);
        await formatear(textoResolucion);
        textoResolucion.classList.remove("cargando");
    }

    return true;
}

async function obtenerExamen(examen, metadatos, guardarMetadatos) {
    controlador.abort();
    controlador = new AbortController();
    indicacion = controlador.signal;
    main.textContent = "";

    const comunidad = examen.slice(0, 2);
    const curso = examen.slice(-4);
    const titulo = "Examen de " + curso + " de " + comunidades.get(comunidad);
    const { encabezado, boton } = encabezadoExamen(titulo);
    main.append(encabezado);

    const datos = await descargarMetadatos(metadatos, guardarMetadatos);
    const metadatosFiltrados = datos.filter(dato => dato.problema.startsWith(examen));
    const problemas = metadatosFiltrados.length;

    const promesas = [];

    for (let numero = 1; numero <= problemas; numero++) {
        let codigo = examen + numero;
        if (numero < 10) codigo = examen + "0" + numero;
        const datosProblema = metadatosFiltrados.find(dato => dato.problema == codigo);
        const problema = new Problema(codigo, datosProblema.resuelto, datosProblema.categorias);
        const articulo = document.createElement("article");
        main.append(articulo);

        let prioridad;
        if (numero <= 3) prioridad = "high";
        promesas.push(obtenerProblema(articulo, problema, false, prioridad));
    }

    await Promise.all(promesas).catch(() => { return false; });
    boton.disabled = false;
    return true;
}

async function obtenerCategoria(categoria, metadatos, contador, soloResueltos, guardarMetadatos) {
    controlador.abort();
    controlador = new AbortController();
    indicacion = controlador.signal;
    main.textContent = "";

    const datos = await descargarMetadatos(metadatos, guardarMetadatos);
    let problemas;
    if (!categoria) problemas = datos.filter(problema => !problema.categorias);
    else problemas = datos.filter(problema => problema.categorias && problema.categorias.map(c => normalizar(c)).includes(categoria));
    let total = problemas.length;
    if (soloResueltos) total = problemas.filter(problema => problema.resuelto).length;
    contador.textContent = total;

    const promesas = [];

    problemas.forEach((objeto, indice) => {
        const problema = new Problema(objeto.problema, objeto.resuelto, objeto.categorias);
        const articulo = document.createElement("article");
        main.append(articulo);

        let prioridad = "auto";
        if (indice < 5) prioridad = "high";
        promesas.push(obtenerProblema(articulo, problema, true, prioridad));
    });

    await Promise.all(promesas).catch(() => { return false; });
    return true;
}

function problemaAleatorio(problemas, excepciones = []) {
    let aleatorio = problemas[Math.floor(Math.random() * problemas.length)];
    while (excepciones.includes(aleatorio)) aleatorio = problemas[Math.floor(Math.random() * problemas.length)];

    return aleatorio;
}

async function obtenerExamenGenerado(comunidadSeleccionada, numeroProblemas, metadatos, guardarMetadatos) {
    main.textContent = "";

    const { encabezado, boton } = encabezadoExamen("Examen generado");
    main.append(encabezado);

    const datos = await descargarMetadatos(metadatos, guardarMetadatos);
    const datosFiltrados = datos.filter(objeto => {
        const comunidad = objeto.problema.slice(0, 2);
        return !comunidadSeleccionada || comunidad == comunidadSeleccionada;
    });

    let problemas = [];
    for (let i = 1; i <= numeroProblemas; i++) {
        if (i == 1) problemas.push(problemaAleatorio(datosFiltrados.filter(objeto => objeto.categorias && objeto.categorias.includes("Análisis"))));
        else if (i == 2) problemas.push(problemaAleatorio(datosFiltrados.filter(objeto => objeto.categorias && objeto.categorias.includes("Álgebra")), problemas));
        else if (i == 3) problemas.push(problemaAleatorio(datosFiltrados.filter(objeto => objeto.categorias && objeto.categorias.includes("Geometría")), problemas));
        else if (i == 4) problemas.push(problemaAleatorio(datosFiltrados.filter(objeto => objeto.categorias && objeto.categorias.includes("Probabilidad")), problemas));
        else problemas.push(problemaAleatorio(datosFiltrados, problemas));
    }

    const promesas = [];

    for (let numero = 1; numero <= numeroProblemas; numero++) {
        const objeto = problemas[numero - 1];
        const problema = new Problema(objeto.problema, objeto.resuelto, objeto.categorias);
        const articulo = document.createElement("article");
        main.append(articulo);
        promesas.push(obtenerProblema(articulo, problema, true));
    }

    await Promise.all(promesas);

    boton.disabled = false;
    return true;
}