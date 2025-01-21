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
    const ejeX = [];
    const ejeY1 = [];
    const ejeY2 = [];
    const ratios = [];

    const respuesta = await fetch("data/estadisticas.json");
    const datos = await respuesta.json();

    datos.forEach((dato) => {
        const { curso, plazas, opositores } = dato;

        ejeX.push(curso);
        ejeY1.push(plazas);
        ejeY2.push(opositores);
        ratios.push(opositores / plazas);
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
    }

    const ctxPlazas = document.getElementById("grafica-plazas");
    const graficaPlazas = new Chart(ctxPlazas, {
        type: "line",
        data: {
            labels: ejeX,
            datasets: [
                {
                    label: "Plazas",
                    data: ejeY1
                },
                {
                    label: "Opositores",
                    data: ejeY2
                }
            ]
        },
        options: options
    });

    const ctxRatios = document.getElementById("grafica-ratios");
    const graficaRatios = new Chart(ctxRatios, {
        type: "line",
        data: {
            labels: ejeX,
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
    graficas.push(graficaRatios);
}

async function obtenerDatos() {
    const seccion = document.querySelector("#estadisticas");

    const respuesta = await fetch("data\\metadata.json");
    const datos = await respuesta.json();

    const numeroProblemas = datos.length;

    const tarjetaProblemas = document.createElement("div");
    tarjetaProblemas.classList.add("tarjeta");
    tarjetaProblemas.textContent = numeroProblemas + " problemas";

    const numeroProblemasResueltos = datos.filter((problema) => problema.resuelto).length;

    const tarjetaProblemasResueltos = document.createElement("div");
    tarjetaProblemasResueltos.classList.add("tarjeta");
    tarjetaProblemasResueltos.textContent = numeroProblemasResueltos + " problemas resueltos";

    const tarjetaPorcentajeResueltos = document.createElement("div");
    tarjetaPorcentajeResueltos.classList.add("tarjeta");
    tarjetaPorcentajeResueltos.textContent = (numeroProblemasResueltos / numeroProblemas * 100).toFixed(2).replace(".", ",") + "% resuelto";

    seccion.append(tarjetaProblemas, tarjetaProblemasResueltos, tarjetaPorcentajeResueltos);
    seccion.classList.remove("cargando");
}

crearGraficas();
obtenerDatos();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", actualizarGrafica);