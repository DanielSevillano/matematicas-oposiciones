import { CategoryScale, Chart, Colors, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.js/+esm";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Colors);

const formulario = document.querySelector("form");
const temas = document.querySelector("#temas");
const grafica = document.querySelector("#grafica");

function formatear() {
    if (math) return window.MathJax.typesetPromise();
    else setTimeout(formatear);
}

function probabilidad(k) {
    return k * (139 - k) * (k ** 2 - 139 * k + 9658) / 23319240 * 100;
}

function procesar(event) {
    event.preventDefault();

    const k = parseInt(temas.value);

    let texto = document.querySelector("#texto");
    if (!texto) {
        texto = document.createElement("p");
        texto.id = "texto";
        formulario.append(texto);
    }

    texto.innerHTML = "La probabilidad de que salga al menos un tema de los que te has preparado es del <b>" + String(Math.floor(probabilidad(k) * 100) / 100).replace(".", ",") + "%</b>.";
}

async function crearGrafica() {
    const ejeX = Array.from({ length: 14 }, (_, i) => 5 * i).concat(Array([71]));
    const ejeY = ejeX.map((k) => probabilidad(k));

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

    new Chart(grafica, {
        type: "line",
        data: {
            labels: ejeX,
            datasets: [
                {
                    label: "Probabilidad",
                    data: ejeY
                }
            ]
        },
        options: options
    });
}

formatear();
formulario.addEventListener("submit", procesar);
crearGrafica();