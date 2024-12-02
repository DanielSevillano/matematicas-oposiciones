let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]],
        macros: {
            arcsin: "\\operatorname{arcsen}",
            dist: "\\operatorname{dist}",
            Dom: "\\operatorname{Dom}",
            Pot: "\\operatorname{Pot}",
            rang: "\\operatorname{rang}",
            sin: "\\operatorname{sen}"
        }
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