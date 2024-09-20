const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const curso = parametros.get("curso");

const main = document.querySelector("main");
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

function pulsar(boton) {
    const curso = boton.id.replace("boton-", "");
    mostrarSaberes(curso);
    history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?curso=" + curso);

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

if (curso) {
    try {
        document.querySelector("#boton-" + curso).click();
    }
    catch {
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname);
    }
}