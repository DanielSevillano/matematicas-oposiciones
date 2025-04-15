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
            Id: "\\operatorname{Id}",
            Im: "\\operatorname{Im}",
            ker: "\\operatorname{Ker}",
            lim: "\\mathop{\\,\\:\\mathrm{lím}\\,\\:}",
            max: "\\mathop{\\,\\mathrm{máx}\\,}",
            mod: "\\operatorname{mod}",
            Pot: "\\operatorname{Pot}",
            rang: "\\operatorname{rang}",
            sin: "\\operatorname{sen}",
            sinh: "\\operatorname{senh}",
            tan: "\\operatorname{tg}"
        }
    },
    options: {
        enableMenu: false,
        menuOptions: {
            settings: {
                braille: false,
                speech: false,
                enrich: false
            }
        }
    },
    startup: {
        ready: () => {
            MathJax.startup.defaultReady();
            MathJax.startup.promise.then(() => math = true);
        }
    }
};