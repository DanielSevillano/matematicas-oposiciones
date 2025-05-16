const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const codigo = parametros.get("codigo");

const main = document.querySelector("main");
const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const botones = document.querySelectorAll(".contorno");

let listaCompetenciasEspecificas;
let listaCompetenciasClave;
let listaDescriptores;
let listaCriterios;
let listaObjetivos;

async function obtenerSaberes(curso) {
    main.textContent = "";
    main.classList.add("cargando");

    const respuesta = await fetch("data\\saberes\\" + curso + ".txt");
    const datos = await respuesta.text();

    main.innerHTML = datos;

    const titulo = main.querySelector("h2");
    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    main.classList.remove("cargando");
}

async function obtenerCompetencias(nivel) {
    main.textContent = "";
    main.classList.add("cargando");

    let datos;
    if (!listaCompetenciasEspecificas) {
        const respuesta = await fetch("data\\competencias-especificas.json");
        datos = await respuesta.json();
        listaCompetenciasEspecificas = datos;
    } else datos = listaCompetenciasEspecificas;
    const competencias = datos.filter((competencia => competencia.nivel == nivel));

    const titulo = document.createElement("h2");
    if (nivel == "MAT") titulo.textContent = "📋 Competencias específicas de la ESO";
    else if (nivel == "MACS") titulo.textContent = "📋 Competencias específicas de Bachillerato de Sociales";
    else titulo.textContent = "📋 Competencias específicas de Bachillerato de Ciencias";

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    const lista = document.createElement("ol");

    competencias.forEach((competencia) => {
        const elemento = document.createElement("li");
        elemento.innerText = competencia.descripcion;

        const descriptores = document.createElement("ul");
        descriptores.classList.add("categorias");

        competencia.descriptores.forEach((descriptor) => {
            const categoria = document.createElement("li");
            const enlace = document.createElement("a");
            enlace.classList.add("contorno");
            enlace.textContent = descriptor;
            enlace.href = direccion.pathname + "?codigo=DO" + descriptor.split(".")[0].slice(0, -1);

            categoria.append(enlace);
            descriptores.append(categoria);
        });

        elemento.append(descriptores);

        lista.append(elemento);
    });

    main.append(titulo, lista);
    main.classList.remove("cargando");
}

async function obtenerDescriptores(competencia) {
    main.textContent = "";
    main.classList.add("cargando");

    let datosCompetencias;
    if (!listaCompetenciasClave) {
        const respuesta = await fetch("data\\competencias-clave.json");
        datosCompetencias = await respuesta.json();
        listaCompetenciasClave = datosCompetencias;
    } else datosCompetencias = listaCompetenciasClave;
    const competenciaClave = datosCompetencias.filter((c) => c.codigo == competencia)[0];

    let datos;
    if (!listaDescriptores) {
        const respuesta = await fetch("data\\descriptores.json");
        datos = await respuesta.json();
        listaDescriptores = datos;
    } else datos = listaDescriptores;
    const descriptores = datos.filter((descriptor => descriptor.codigo.slice(0, -1) == competencia));

    const titulo = document.createElement("h2");
    titulo.textContent = "📋 " + competenciaClave.nombre;

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    const descripcion = document.createElement("p");
    descripcion.textContent = competenciaClave.descripcion;

    main.append(titulo, descripcion);

    descriptores.forEach((descriptor) => {
        const subtitulo = document.createElement("h3");
        subtitulo.id = descriptor.codigo;
        subtitulo.textContent = "Descriptor " + descriptor.codigo;

        main.append(subtitulo);

        const lista = document.createElement("ul");

        descriptor.perfiles.forEach((perfil, indice) => {
            const seccion = document.createElement("li");
            const elemento = document.createElement("b");
            if (indice == 0) elemento.textContent = "Perfil competencial. ";
            else if (indice == 1) elemento.textContent = "Perfil de salida. ";
            else elemento.textContent = "Perfil de Bachillerato. ";

            seccion.append(elemento);
            seccion.innerHTML += perfil;

            lista.append(seccion);
        });

        main.append(lista);
    });

    main.classList.remove("cargando");
}

async function obtenerCriterios(nivel) {
    main.textContent = "";
    main.classList.add("cargando");

    let datos;
    if (!listaCriterios) {
        const respuesta = await fetch("data\\criterios.json");
        datos = await respuesta.json();
        listaCriterios = datos;
    } else datos = listaCriterios;
    const criterios = datos.filter((criterio => criterio.nivel == nivel));

    const titulo = document.createElement("h2");
    if (nivel == "MAT1") titulo.textContent = "📋 Criterios de evaluación de 1º de la ESO";
    else if (nivel == "MAT2") titulo.textContent = "📋 Criterios de evaluación de 2º de la ESO";
    else if (nivel == "MAT3") titulo.textContent = "📋 Criterios de evaluación de 3º de la ESO";
    else if (nivel == "MAA") titulo.textContent = "📋 Criterios de evaluación de 4º de la ESO A";
    else if (nivel == "MAB") titulo.textContent = "📋 Criterios de evaluación de 4º de la ESO B";
    else if (nivel == "MATE1") titulo.textContent = "📋 Criterios de evaluación de 1º de Bachillerato de Ciencias";
    else if (nivel == "MATE2") titulo.textContent = "📋 Criterios de evaluación de 2º de Bachillerato de Ciencias";
    else if (nivel == "MACS1") titulo.textContent = "📋 Criterios de evaluación de 1º de Bachillerato de Sociales";
    else titulo.textContent = "📋 Criterios de evaluación de 2º de Bachillerato de Sociales";

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    const lista = document.createElement("ul");

    criterios.forEach((criterio) => {
        const elemento = document.createElement("li");
        elemento.innerHTML = "<b>" + criterio.codigo + ".</b> " + criterio.descripcion;

        const saberes = document.createElement("ul");
        saberes.classList.add("categorias");

        criterio.saberes.forEach((saber) => {
            const categoria = document.createElement("li");
            const enlace = document.createElement("a");
            enlace.classList.add("contorno");
            enlace.textContent = saber;
            enlace.href = direccion.pathname + "?codigo=SB" + nivel;

            categoria.append(enlace);
            saberes.append(categoria);
        });

        elemento.append(saberes);

        lista.append(elemento);
    });

    main.append(titulo, lista);
    main.classList.remove("cargando");
}

async function obtenerObjetivos(etapa) {
    main.textContent = "";
    main.classList.add("cargando");

    let datos;
    if (!listaObjetivos) {
        const respuesta = await fetch("data\\objetivos.json");
        datos = await respuesta.json();
        listaObjetivos = datos;
    } else datos = listaObjetivos;
    const objetivos = datos.filter((objetivo => objetivo.etapa == etapa));

    const titulo = document.createElement("h2");
    if (etapa == "ESO") titulo.textContent = "📋 Objetivos de etapa de la ESO";
    else titulo.textContent = "📋 Objetivos de etapa de Bachillerato";

    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);

    const lista = document.createElement("ol");
    lista.classList.add("letras");

    objetivos.forEach((objetivo) => {
        const elemento = document.createElement("li");
        elemento.textContent = objetivo.descripcion;
        lista.append(elemento);
    });

    main.append(titulo, lista);
    main.classList.remove("cargando");
}

grupos.forEach((grupo, indice) => {
    grupo.addEventListener("click", () => {
        grupos.forEach(g => {
            if (grupo == g) g.classList.add("seleccionado");
            else g.classList.remove("seleccionado");
        });

        contenidoGrupos.forEach((contenido, i) => {
            if (indice == i) contenido.classList.add("visible");
            else contenido.classList.remove("visible");
        });
    });
});

function pulsar(boton) {
    if (main.classList.contains("cargando")) return;

    const clave = boton.id.replace("boton-", "");
    const identificador = clave.slice(0, 2);

    if (identificador == "SB") {
        const curso = clave.replace("SB", "");
        obtenerSaberes(curso);
    } else if (identificador == "CE") {
        const nivel = clave.replace("CE", "");
        obtenerCompetencias(nivel);
    } else if (identificador == "DO") {
        const competencia = clave.replace("DO", "");
        obtenerDescriptores(competencia);
    } else if (identificador == "EV") {
        const nivel = clave.replace("EV", "");
        obtenerCriterios(nivel);
    } else if (identificador == "OE") {
        const etapa = clave.replace("OE", "");
        obtenerObjetivos(etapa);
    }

    history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?codigo=" + clave);

    botones.forEach(b => {
        if (boton == b) b.classList.add("seleccionado");
        else b.classList.remove("seleccionado");
    });
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) pulsar(boton);
    });
});

if (!codigo) document.querySelector(".grupo").click();
else {
    const identificador = codigo.slice(0, 2);

    try {
        document.querySelector("#boton-" + codigo).click();
        document.querySelector("#grupo-" + identificador).click();
    }
    catch {
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname);
    }
}