import { CategoryScale, Chart, Colors, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.js/+esm";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Colors);

const graficas = [];

function actualizarGrafica() {
    graficas.forEach((grafica) => {
        grafica.options.scales.x.grid.color = getComputedStyle(document.body).getPropertyValue("--border-color");
        grafica.options.scales.y.grid.color = getComputedStyle(document.body).getPropertyValue("--border-color");
        grafica.options.scales.x.ticks.color = getComputedStyle(document.body).getPropertyValue("--on-button");
        grafica.options.scales.y.ticks.color = getComputedStyle(document.body).getPropertyValue("--on-button");
        grafica.options.plugins.legend.labels.color = getComputedStyle(document.body).getPropertyValue("--on-button");
        grafica.update();
    });
}

async function crearGraficas() {
    const ejeX1 = [];
    const ejeX2 = [];
    const ejeY1 = [];
    const ejeY2 = [];
    const ejeOpositores = [];
    const ratios = [];

    const respuesta = await fetch("data/estadisticas.json");
    const datos = await respuesta.json();

    datos.forEach((dato) => {
        const { curso, plazasTotales, turnoGeneral, opositores } = dato;

        ejeX1.push(curso);
        ejeY1.push(plazasTotales);
        ejeY2.push(turnoGeneral);
        if (opositores) {
            ejeX2.push(curso);
            ejeOpositores.push(opositores);
            ratios.push(opositores / plazasTotales);
        }
    });

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: getComputedStyle(document.body).getPropertyValue("--on-button")
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: getComputedStyle(document.body).getPropertyValue("--border-color")
                },
                ticks: {
                    color: getComputedStyle(document.body).getPropertyValue("--on-button")
                }
            },
            y: {
                grid: {
                    color: getComputedStyle(document.body).getPropertyValue("--border-color")
                },
                ticks: {
                    color: getComputedStyle(document.body).getPropertyValue("--on-button")
                }
            }
        }
    };

    const ctxPlazas = document.getElementById("grafica-plazas");
    const graficaPlazas = new Chart(ctxPlazas, {
        type: "line",
        data: {
            labels: ejeX1,
            datasets: [
                {
                    label: "Plazas totales",
                    data: ejeY1
                },
                {
                    label: "Turno general",
                    data: ejeY2,
                    hidden: true
                }
            ]
        },
        options: options
    });

    const ctxOpositores = document.getElementById("grafica-opositores");
    const graficaOpositores = new Chart(ctxOpositores, {
        type: "line",
        data: {
            labels: ejeX2,
            datasets: [
                {
                    label: "Opositores",
                    data: ejeOpositores
                }
            ]
        },
        options: options
    });

    const ctxRatios = document.getElementById("grafica-ratios");
    const graficaRatios = new Chart(ctxRatios, {
        type: "line",
        data: {
            labels: ejeX2,
            datasets: [
                {
                    label: "Ratios",
                    data: ratios
                }
            ]
        },
        options: options
    });

    graficas.push(graficaPlazas);
    graficas.push(graficaOpositores);
    graficas.push(graficaRatios);
}

async function obtenerDatos() {
    const seccion = document.querySelector("#estadisticas");

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const problemasAndalucia = datos.filter((objeto) => objeto.problema.slice(0, 2) == "AN");
    const numeroProblemas = problemasAndalucia.length;

    const tarjetaProblemas = document.createElement("div");
    tarjetaProblemas.classList.add("tarjeta");
    tarjetaProblemas.textContent = numeroProblemas + " problemas";

    const examenes = new Set();
    problemasAndalucia.forEach((objeto) => {
        examenes.add(objeto.problema.slice(0, 6));
    });

    const tarjetaExamenes = document.createElement("div");
    tarjetaExamenes.classList.add("tarjeta");
    tarjetaExamenes.textContent = examenes.size + " exámenes";

    const numeroProblemasResueltos = problemasAndalucia.filter((problema) => problema.resuelto).length;

    const tarjetaProblemasResueltos = document.createElement("div");
    tarjetaProblemasResueltos.classList.add("tarjeta");
    tarjetaProblemasResueltos.textContent = numeroProblemasResueltos + " problemas resueltos";

    const tarjetaPorcentajeResueltos = document.createElement("div");
    tarjetaPorcentajeResueltos.classList.add("tarjeta");
    tarjetaPorcentajeResueltos.textContent = (numeroProblemasResueltos / numeroProblemas * 100).toFixed(2).replace(".", ",") + "% resuelto";

    seccion.append(tarjetaProblemas, tarjetaExamenes, tarjetaProblemasResueltos, tarjetaPorcentajeResueltos);
    seccion.classList.remove("cargando");
}

crearGraficas();
obtenerDatos();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", actualizarGrafica);