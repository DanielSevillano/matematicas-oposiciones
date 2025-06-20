const formulario = document.querySelector("form");
const temas = document.querySelector("#temas");

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

formatear();
formulario.addEventListener("submit", procesar);