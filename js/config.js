let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]]
    },
    options: {
        enableMenu: false
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            MathJax.startup.promise.then(() => math = true);
        }
    }
};