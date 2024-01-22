window.PlotlyConfig = {MathJaxConfig: "local"}
window.MathJax = {
    startup: {
      //
      //  Mapping of old extension names to new ones
      //
      requireMap: {
        AMSmath: 'ams',
        AMSsymbols: 'ams',
        AMScd: 'amscd',
        SVG: 'svg',
        noErrors: 'noerrors',
        noUndefined: 'noundefined'
      },
      ready() {
        // Here and later using recipe from https://github.com/mathjax/MathJax/issues/2705
        //
        //  Get the MathJax modules that we need.
        //
        const {mathjax} = MathJax._.mathjax;
        const {SVG} = MathJax._.output.svg_ts;

        // Now using https://docs.mathjax.org/en/v3.2-latest/upgrading/v2.html#version-2-compatibility-example
        //
        //  Replace the require command map with a new one that checks for
        //    renamed extensions and converts them to the new names.
        //
        var CommandMap = MathJax._.input.tex.SymbolMap.CommandMap;
        var requireMap = MathJax.config.startup.requireMap;
        var RequireLoad = MathJax._.input.tex.require.RequireConfiguration.RequireLoad;
        var RequireMethods = {
          Require: function (parser, name) {
            var required = parser.GetArgument(name);
            if (required.match(/[^_a-zA-Z0-9]/) || required === '') {
              throw new TexError('BadPackageName', 'Argument for %1 is not a valid package name', name);
            }
            if (requireMap.hasOwnProperty(required)) {
              required = requireMap[required];
            }
            RequireLoad(parser, required);
          }
        };
        new CommandMap('require', {require: 'Require'}, RequireMethods);
        MathJax.Callback = function (args) {
            if (Array.isArray(args)) {
                if (args.length === 1 && typeof(args[0]) === 'function') {
                return args[0];
                } else if (typeof(args[0]) === 'string' && args[1] instanceof Object &&
                        typeof(args[1][args[0]]) === 'function') {
                return Function.bind.apply(args[1][args[0]], args.slice(1));
                } else if (typeof(args[0]) === 'function') {
                return Function.bind.apply(args[0], [window].concat(args.slice(1)));
                } else if (typeof(args[1]) === 'function') {
                return Function.bind.apply(args[1], [args[0]].concat(args.slice(2)));
                }
            } else if (typeof(args) === 'function') {
                return args;
            }
            throw Error("Can't make callback from given data");
        };
        //
        // Add a replacement for MathJax.Hub commands
        //
        MathJax.Hub = {
            Queue: function () {
                for (var i = 0, m = arguments.length; i < m; i++) {
                    var fn = MathJax.Callback(arguments[i]);
                    MathJax.startup.promise = MathJax.startup.promise.then(fn);
                }
                return MathJax.startup.promise;
            },
            Typeset: function (element, callback) {
                var promise = MathJax.typesetSVGPromise([element]).then(
                    () => {
                        element.firstElementChild.classList.add("MathJax_SVG");
                    }
                );
                if (callback) {
                    promise = promise.then(callback);
                }
                return promise;
            },
            Config: function () {},
            Configured: function () {},
            config: {menuSettings: {renderer: "SVG"}}
        };

        MathJax.startup.defaultReady();

        // Continuing from https://github.com/mathjax/MathJax/issues/2705
        //
        //  Create an SVG output jax and a new MathDocument that uses it.
        //
        const svgOutput = new SVG(MathJax.config.svg);
        const svgDocument = mathjax.document(document, {
            ...MathJax.config.options,
            InputJax: MathJax.startup.input,
            OutputJax: svgOutput
        });
        //
        //  Define the SVG-based conversion methods
        //
        MathJax.svgStylesheet = () => svgOutput.styleSheet(svgDocument);
        MathJax.typesetSVGPromise = (elements) => {
            svgDocument.options.elements = elements;
            svgDocument.reset();
            return mathjax.handleRetriesFor(() => {
                svgDocument.render();
            });
        };

        // Now subscribe to mkdocs page updates.
        document$.subscribe(() => {
            MathJax.typesetPromise()
        });
        document$.subscribe(() => {
            for (const div of document.getElementsByClassName("plotlyPlaceholder")) {
                Plotly.d3.json(div.getAttribute("data-plotlySource"), function(error, fig) {
                    Plotly.plot(div.getAttribute("id"), fig.data, fig.layout)
                  }
                );
            };
        })

      }
    },
    loader: {load: ["output/svg"]},
    tex: {
        inlineMath: [["\\(", "\\)"], ["$", "$"]],
        displayMath: [["\\[", "\\]"], ["$$", "$$"]],
        processEscapes: true,
        processEnvironments: true,
        autoload: {
            color: [],          // don't autoload the color extension
            colorv2: ['color'], // do autoload the colorv2 extension
        }
    }
  };
