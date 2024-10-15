const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const codigo = parametros.get("codigo");

const main = document.querySelector("main");
const grupos = document.querySelectorAll(".grupo");
const contenidoGrupos = document.querySelectorAll(".contenido-grupo");
const botones = document.querySelectorAll(".contorno");

async function obtenerSaberes(curso) {
    const respuesta = await fetch("data\\saberes\\" + curso + ".txt");
    const datos = await respuesta.text();

    main.innerHTML = datos;

    const titulo = main.querySelector("h2");
    const boton = document.createElement("button");
    boton.textContent = "🖨️ Imprimir";
    boton.addEventListener("click", () => window.print());
    titulo.append(boton);
}

async function mostrarSaberes(curso) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerSaberes(curso).then(() => main.classList.remove("cargando"));
}

async function obtenerCompetencias(nivel) {
    const respuesta = await fetch("data\\competencias-especificas.json");
    const datos = await respuesta.json();
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
            enlace.href = direccion.pathname + "?codigo=DO" + descriptor.slice(0, -1);

            categoria.append(enlace);
            descriptores.append(categoria);
        });

        elemento.append(descriptores);

        lista.append(elemento);
    });

    main.append(titulo, lista);
}

async function mostrarCompetencias(nivel) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerCompetencias(nivel).then(() => main.classList.remove("cargando"));
}

async function obtenerDescriptores(competencia) {
    const respuestaCompetencias = await fetch("data\\competencias-clave.json");
    const datosCompetencias = await respuestaCompetencias.json();
    const competenciaClave = datosCompetencias.filter((c) => c.codigo == competencia)[0];

    const respuesta = await fetch("data\\descriptores.json");
    const datos = await respuesta.json();
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
}

async function mostrarDescriptores(competencia) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerDescriptores(competencia).then(() => main.classList.remove("cargando"));
}

async function obtenerCriterios(nivel) {
    const respuesta = await fetch("data\\criterios.json");
    const datos = await respuesta.json();
    const criterios = datos.filter((criterio => criterio.nivel == nivel));

    const titulo = document.createElement("h2");
    if (nivel == "MAT1") titulo.textContent = "📋 Criterios de evaluación de 1º de la ESO";
    else if (nivel == "MAT2") titulo.textContent = "📋 Criterios de evaluación de 2º de la ESO";
    else if (nivel == "MAT3") titulo.textContent = "📋 Criterios de evaluación de 3º de la ESO";
    else if (nivel == "MATA") titulo.textContent = "📋 Criterios de evaluación de 4º de la ESO A";
    else if (nivel == "MATB") titulo.textContent = "📋 Criterios de evaluación de 4º de la ESO B";
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
}

async function mostrarCriterios(nivel) {
    const main = document.querySelector("main");
    main.textContent = "";
    main.classList.add("cargando");

    obtenerCriterios(nivel).then(() => main.classList.remove("cargando"));
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
    const clave = boton.id.replace("boton-", "");
    const identificador = clave.slice(0, 2);

    if (identificador == "SB") {
        const curso = clave.replace("SB", "");
        mostrarSaberes(curso);
    } else if (identificador == "CE") {
        const nivel = clave.replace("CE", "");
        mostrarCompetencias(nivel);
    } else if (identificador == "DO") {
        const competencia = clave.replace("DO", "")
        mostrarDescriptores(competencia);
    } else {
        const nivel = clave.replace("EV", "");
        mostrarCriterios(nivel);
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