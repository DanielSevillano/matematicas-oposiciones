import { estado, mostrarExamen } from "./math.js";

const direccion = new URL(location.href);
const parametros = direccion.searchParams;
const examen = parametros.get("examen");

const main = document.querySelector("main");
const botones = document.querySelectorAll(".contorno");
const botonAleatorio = document.querySelector("#aleatorio");

function pulsar(boton) {
    if (!estado.cancelado) {
        const examen = boton.id.replace("boton-", "");
        mostrarExamen(examen);
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname + "?examen=" + examen);

        botones.forEach(b => {
            if (boton == b) b.classList.add("seleccionado");
            else b.classList.remove("seleccionado");
        });
    }
    else setTimeout(() => pulsar(boton));
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        if (!boton.classList.contains("seleccionado")) {
            if (main.classList.contains("cargando")) estado.cancelar();
            pulsar(boton);
        }
    });
});

botonAleatorio.addEventListener("click", () => {
    const boton = botones[Math.floor(Math.random() * botones.length)];
    boton.click();
});

if (examen) {
    try {
        document.querySelector("#boton-" + examen).click();
    }
    catch {
        history.replaceState(history.state, document.title, direccion.origin + direccion.pathname);
    }
}