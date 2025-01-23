let math = false;

window.MathJax = {
    tex: {
        inlineMath: [["$", "$"]],
        macros: {
            arcsin: "\\operatorname{arcsen}",
            arctan: "\\operatorname{arctg}",
            Bi: "\\operatorname{Bi}",
            dist: "\\operatorname{dist}",
            Dom: "\\operatorname{Dom}",
            Pot: "\\operatorname{Pot}",
            rang: "\\operatorname{rang}",
            sin: "\\operatorname{sen}",
            tan: "\\operatorname{tg}"
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