'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));
var vueFragment = require('vue-fragment');
var elementUi = require('element-ui');

function rgbToHSv(ref) {
    var red = ref.red;
    var green = ref.green;
    var blue = ref.blue;

    var rr;
    var gg;
    var bb;
    var h;
    var s;

    var rabs = red / 255;
    var gabs = green / 255;
    var babs = blue / 255;
    var v = Math.max(rabs, gabs, babs);
    var diff = v - Math.min(rabs, gabs, babs);
    var diffc = function (c) { return (v - c) / 6 / diff + 1 / 2; };
    if (diff === 0) {
        h = 0;
        s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }

    return {
        hue: Math.round(h * 360),
        saturation: Math.round(s * 100),
        value: Math.round(v * 100),
    };
}

function getRgbByHue(hue) {
    var C = 1;
    var H = hue / 60;
    var X = C * (1 - Math.abs(H % 2 - 1));
    var m = 0;
    var precision = 255;
    var r = 0;
    var g = 0;
    var b = 0;

    C = (C + m) * precision | 0;
    X = (X + m) * precision | 0;

    if (H >= 0 && H < 1) {
        r = C | 0;
        g = X | 0;
        b = m | 0;
    }
    if (H >= 1 && H < 2) {
        r = X | 0;
        g = C | 0;
        b = m | 0;
    }
    if (H >= 2 && H < 3) {
        r = m | 0;
        g = C | 0;
        b = X | 0;
    }
    if (H >= 3 && H < 4) {
        r = m | 0;
        g = X | 0;
        b = C | 0;
    }
    if (H >= 4 && H < 5) {
        r = X | 0;
        g = m | 0;
        b = C | 0;
    }
    if (H >= 5 && H <= 6) {
        r = C | 0;
        g = m | 0;
        b = X | 0;
    }

    return {
        red: r,
        green: g,
        blue: b,
    };
}

function isValidRGBValue(value) {
    return (typeof (value) === 'number' && Number.isNaN(value) === false && value >= 0 && value <= 255);
}

function setRGBA(red, green, blue, alpha) {
    if (isValidRGBValue(red) && isValidRGBValue(green) && isValidRGBValue(blue)) {
        var color = {
            red: red | 0,
            green: green | 0,
            blue: blue | 0,
        };

        if (isValidRGBValue(alpha) === true) {
            color.alpha = alpha | 0;
        }

        // RGBToHSL(color.r, color.g, color.b);

        return color;
    }
}

function hsvToRgb(hue, saturation, value) {
    value /= 100;
    var sat = saturation / 100;
    var C = sat * value;
    var H = hue / 60;
    var X = C * (1 - Math.abs(H % 2 - 1));
    var m = value - C;
    var precision = 255;

    C = (C + m) * precision | 0;
    X = (X + m) * precision | 0;
    m = m * precision | 0;

    if (H >= 1 && H < 2) {
        return setRGBA(X, C, m);
    }
    if (H >= 2 && H < 3) {
        return setRGBA(m, C, X);
    }
    if (H >= 3 && H < 4) {
        return setRGBA(m, X, C);
    }
    if (H >= 4 && H < 5) {
        return setRGBA(X, m, C);
    }
    if (H >= 5 && H <= 6) {
        return setRGBA(C, m, X);
    }

    return setRGBA(C, X, m);
}

function changePicker(x, y, height, width, hue) {
    if (x > width) { x = width; }
    if (y > height) { y = height; }
    if (x < 0) { x = 0; }
    if (y < 0) { y = 0; }
    var value = 100 - (y * 100 / height) | 0;
    var saturation = x * 100 / width | 0;
    return Object.assign({}, hsvToRgb(hue, saturation, value),
        {saturation: saturation,
        value: value});
}

function getHue(offsetX, width, saturation, value) {
    var hue = ((360 * offsetX) / width) | 0;

    hue = hue < 0 ? 0 : hue > 360 ? 360 : hue;

    return Object.assign({}, hsvToRgb(hue, saturation, value),
        {hue: hue});
}

function getAlpha(value, width) {
    value = Number((value / width).toFixed(2));

    return value > 1 ? 1 : value < 0 ? 0 : value;
}

function rgbToHex(red, green, blue) {
    var r16 = red.toString(16);
    var g16 = green.toString(16);
    var b16 = blue.toString(16);

    if (red < 16) { r16 = "0" + r16; }
    if (green < 16) { g16 = "0" + g16; }
    if (blue < 16) { b16 = "0" + b16; }

    return r16 + g16 + b16;
}

var hexRegexp = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)|(^#{0,1}[0-9A-F]{8}$)/i;

var regexp = /([0-9A-F])([0-9A-F])([0-9A-F])/i;

function hexToRgb(value) {
    var valid = hexRegexp.test(value);

    if (valid) {
        if (value[0] === '#') { value = value.slice(1, value.length); }

        if (value.length === 3) { value = value.replace(regexp, '$1$1$2$2$3$3'); }

        var red = parseInt(value.substr(0, 2), 16);
        var green = parseInt(value.substr(2, 2), 16);
        var blue = parseInt(value.substr(4, 2), 16);
        var alpha = parseInt(value.substr(6, 2), 16) / 255;

        var color = setRGBA(red, green, blue, alpha);
        var hsv = rgbToHSv(Object.assign({}, color));

        return Object.assign({}, color,
            hsv);
    }

    return false;
}

function updateGradientActivePercent(offsetX, width) {
    var leftPercent = (offsetX * 100) / width;
    return leftPercent < 0 ? 0 : leftPercent > 100 ? 100 : leftPercent;
}

function calculateDegree(x, y, centerX, centerY) {
    var radians = Math.atan2(x - centerX, y - centerY);
    return (radians * (180 / Math.PI) * -1) + 180;
}

function getRightValue(newValue, oldValue) {
    return (!newValue && newValue !== 0) ? oldValue : newValue;
}

function generateSolidStyle(red, green, blue, alpha) {
    return ("rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")");
}

function generateGradientStyle(points, type, degree) {
    var style = '';
    var sortedPoints = points.slice();

    sortedPoints.sort(function (a, b) { return a.left - b.left; });

    if (type === 'linear') {
        style = "linear-gradient(" + degree + "deg,";
    } else {
        style = 'radial-gradient(';
    }

    sortedPoints.forEach(function (point, index) {
        style += "rgba(" + (point.red) + ", " + (point.green) + ", " + (point.blue) + ", " + (point.alpha) + ") " + (point.left) + "%";

        if (index !== sortedPoints.length - 1) {
            style += ',';
        }
    });
    
    style += ')';

    return style;
}

function useMouseEvents(mouseDownHandler, mouseMoveHandler, mouseUpHandler) {
    return function mouseEventsHandler(event) {
        var positions = mouseDownHandler(event);

        function onMouseMove(event) {
            positions = mouseMoveHandler(event, positions) || positions;
        }

        window.addEventListener('mousemove', onMouseMove);

        window.addEventListener('mouseup', function (event) {
            window.removeEventListener('mousemove', onMouseMove);

            mouseUpHandler && mouseUpHandler(event, positions);
        }, { once: true });
    };
}

var script = {
    name: "Picker",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        hue: Number,
        saturation: Number,
        value: Number,
        updateColor: Function,
    },

    data: function data() {
        return {
            width: 0,
            height: 0,
            mouseEvents: function () {},
        }
    },

    mounted: function mounted() {
        var ref = this.$refs;
        var pickerAreaRef = ref.pickerAreaRef;

        if (pickerAreaRef) {
            this.width = pickerAreaRef.clientWidth;
            this.height = pickerAreaRef.clientHeight;
        }

        this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },

    computed: {
        offsetLeft: function offsetLeft() {
            return ((this.saturation * this.width / 100) | 0) - 6;
        },

        offsetTop: function offsetTop() {
            return (this.height - (this.value * this.height / 100) | 0) - 6;
        },

        pointerStyle: function pointerStyle() {
            return {
                backgroundColor: ("rgb(" + (this.red) + ", " + (this.green) + ", " + (this.blue) + ")"),
                left: ((this.offsetLeft) + "px"),
                top: ((this.offsetTop) + "px"),
            }
        },

        pickerStyle: function pickerStyle() {
            var ref = getRgbByHue(this.hue);
            var red = ref.red;
            var green = ref.green;
            var blue = ref.blue;

            return { backgroundColor: ("rgb(" + red + ", " + green + ", " + blue + ")") };
        }
    },

    methods: {
        mouseDownHandler: function mouseDownHandler(event) {
            var ref = this.$refs.pickerAreaRef.getBoundingClientRect();
            var elementX = ref.x;
            var elementY = ref.y;
            var startX = event.pageX;
            var startY = event.pageY;
            var positionX = startX - elementX;
            var positionY = startY - elementY;

            var color = changePicker(positionX, positionY, this.height, this.width, this.hue);

            this.updateColor(color, 'onStartChange');
            return {
                startX: startX,
                startY: startY,
                positionX: positionX,
                positionY: positionY,

            };
        },

        changeObjectPositions: function changeObjectPositions(event, ref) {
            var startX = ref.startX;
            var startY = ref.startY;
            var positionX = ref.positionX;
            var positionY = ref.positionY;

            var moveX = event.pageX - startX;
            var moveY = event.pageY - startY;
            positionX += moveX;
            positionY += moveY;

            var color = changePicker(positionX, positionY, this.height, this.width, this.hue);

            return {
                positions: {
                    positionX: positionX,
                    positionY: positionY,
                    startX: event.pageX,
                    startY: event.pageY,
                },
                color: color,
            };
        },

        mouseMoveHandler: function mouseMoveHandler(event, ref) {
            var startX = ref.startX;
            var startY = ref.startY;
            var positionX = ref.positionX;
            var positionY = ref.positionY;

            var ref$1 = this.changeObjectPositions(event, {
                startX: startX, startY: startY, positionX: positionX, positionY: positionY,
            });
            var positions = ref$1.positions;
            var color = ref$1.color;

            this.updateColor(color, 'onChange');

            return positions;
        },

        mouseUpHandler: function mouseUpHandler(event, ref) {
            var startX = ref.startX;
            var startY = ref.startY;
            var positionX = ref.positionX;
            var positionY = ref.positionY;

            var ref$1 = this.changeObjectPositions(event, {
                startX: startX, startY: startY, positionX: positionX, positionY: positionY,
            });
            var positions = ref$1.positions;
            var color = ref$1.color;

            this.updateColor(color, 'onEndChange');

            return positions;
        },
    }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      ref: "pickerAreaRef",
      staticClass: "picking-area",
      style: _vm.pickerStyle,
      on: { mousedown: _vm.mouseEvents }
    },
    [
      _c("div", { staticClass: "picking-area-overlay1" }, [
        _c("div", { staticClass: "picking-area-overlay2" }, [
          _c("div", { staticClass: "picker-pointer", style: _vm.pointerStyle })
        ])
      ])
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

var script$1 = {
    name: "area-preview",

    props: {
        isGradient: Boolean,
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        points: Array,
        gradientDegree: Number,
        gradientType: String,
    },

    computed: {
        style: function style() {
            if (this.isGradient) {
                var style$1 = generateGradientStyle(this.points, this.gradientType, this.gradientDegree);

                return { background: style$1 };
            }

            var style = generateSolidStyle(this.red, this.green, this.blue, this.alpha);

            return { backgroundColor: style };
        }
    }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "preview-area" }, [
    _c("div", { staticClass: "preview-box", style: _vm.style })
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

var script$2 = {
    name: "hue",

    props: {
        hue: Number,
        saturation: Number,
        value: Number,
        updateColor: Function,
    },

    data: function data() {
        return {
            height: 0,
            mouseEvents: function () {},
        }
    },

    mounted: function mounted() {
        var ref = this.$refs;
        var hueRef = ref.hueRef;

        if (hueRef) {
            this.height = hueRef.clientHeight;
        }

        this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },

    computed: {
        offsetTop: function offsetTop() {
            return ((this.hue * this.height / 360) | 0) - 6;
        },

        pointerStyle: function pointerStyle() {
            return {
                top: ((this.offsetTop) + "px"),
            }
        },
    },

    methods: {
        mouseDownHandler: function mouseDownHandler(event) {
            var elementY = event.currentTarget.getBoundingClientRect().y;
            var startY = event.pageY;
            var positionY = startY - elementY;

            var color = getHue(positionY, this.height, this.saturation, this.value);

            this.updateColor(color, 'onStartChange');

            return {
                startY: startY,
                positionY: positionY,
            };
        },

        changeObjectPositions: function changeObjectPositions(event, ref) {
            var startY = ref.startY;
            var positionY = ref.positionY;

            var moveY = event.pageY - startY;
            positionY += moveY;

            // update value and saturation
            var offsetY = positionY > this.height ? this.height : positionY <= 0 ? 0 : positionY;
            var color = getHue(offsetY, this.height, this.saturation, this.value);

            return {
                positions: {
                    positionY: positionY,
                    startY: event.pageY,
                },
                color: color,
            };
        },

        mouseMoveHandler: function mouseMoveHandler(event, ref) {
            var startY = ref.startY;
            var positionY = ref.positionY;

            var ref$1 = this.changeObjectPositions(event, { startY: startY, positionY: positionY });
            var positions = ref$1.positions;
            var color = ref$1.color;

            this.updateColor(color, 'onChange');

            return positions;
        },

        mouseUpHandler: function mouseUpHandler(event, ref) {
            var startY = ref.startY;
            var positionY = ref.positionY;

            var ref$1 = this.changeObjectPositions(event, { startY: startY, positionY: positionY });
            var positions = ref$1.positions;
            var color = ref$1.color;

            this.updateColor(color, 'onEndChange');

            return positions;
        },
    }
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "hue", on: { mousedown: _vm.mouseEvents } }, [
    _c("div", { ref: "hueRef", staticClass: "hue-area" }, [
      _c("div", { staticClass: "picker-pointer", style: _vm.pointerStyle })
    ])
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  var __vue_inject_styles__$2 = undefined;
  /* scoped */
  var __vue_scope_id__$2 = undefined;
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$2 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    undefined,
    undefined,
    undefined
  );

var script$3 = {
    name: "alpha",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        updateColor: Function,
    },

    data: function data() {
        return {
            height: 0,
            mouseEvents: function () {},
        }
    },

    mounted: function mounted() {
        var ref = this.$refs;
        var alphaMaskRef = ref.alphaMaskRef;

        if (alphaMaskRef) {
            this.height = alphaMaskRef.clientHeight;
        }

        this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },

    computed: {
        offsetTop: function offsetTop() {
            return ((this.alpha * this.height) | 0) - 6;
        },

        pointerStyle: function pointerStyle() {
            return {top: ((this.offsetTop) + "px"),}
        },

        style: function style() {
            return {
                background: ("linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(" + (this.red) + ", " + (this.green) + ", " + (this.blue) + "))"),
            }
        }
    },

    methods: {
        mouseDownHandler: function mouseDownHandler(event) {
            var elementY = event.currentTarget.getBoundingClientRect().y;
            var startY = event.pageY;
            var positionY = startY - elementY;

            this.updateColor({ alpha: getAlpha(positionY, this.height) }, 'onStartChange');

            return {
                startY: startY,
                positionY: positionY,

            };
        },

        changeObjectPositions: function changeObjectPositions(event, ref) {
            var startY = ref.startY;
            var positionY = ref.positionY;

            var moveY = event.pageY - startY;
            positionY += moveY;

            var alpha = getAlpha(positionY, this.height);

            return {
                positions: {
                    positionY: positionY,
                    startY: event.pageY,
                },
                alpha: alpha,
            };
        },

        mouseMoveHandler: function mouseMoveHandler(event, ref) {
            var startY = ref.startY;
            var positionY = ref.positionY;

            var ref$1 = this.changeObjectPositions(event, { startY: startY, positionY: positionY });
            var positions = ref$1.positions;
            var alpha = ref$1.alpha;

            this.updateColor({ alpha: alpha }, 'onChange');

            return positions;
        },

        mouseUpHandler: function mouseUpHandler(event, ref) {
            var startY = ref.startY;
            var positionY = ref.positionY;

            var ref$1 = this.changeObjectPositions(event, { startY: startY, positionY: positionY });
            var positions = ref$1.positions;
            var alpha = ref$1.alpha;

            this.updateColor({ alpha: alpha }, 'onEndChange');

            return positions;
        },
    }
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "alpha", on: { mousedown: _vm.mouseEvents } },
    [
      _c("div", { staticClass: "gradient", style: _vm.style }),
      _vm._v(" "),
      _c("div", { staticClass: "alpha-area" }, [
        _c("div", { ref: "alphaMaskRef", staticClass: "alpha-mask" }, [
          _c("div", { staticClass: "picker-pointer", style: _vm.pointerStyle })
        ])
      ])
    ]
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  var __vue_inject_styles__$3 = undefined;
  /* scoped */
  var __vue_scope_id__$3 = undefined;
  /* module identifier */
  var __vue_module_identifier__$3 = undefined;
  /* functional template */
  var __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$3 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

var script$4 = {
    name: "GradientPoint",

    props: {
        point: Object,
        activePointIndex: Number,
        index: Number,
        width: Number,
        positions: Object,
        changeActivePointIndex: Function,
        updateGradientLeft: Function,
        removePoint: Function,
    },

    data: function data() {
        return {
            mouseEvents: function () {},
        }
    },

    mounted: function mounted() {
        this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },

    computed: {
        activeClassName: function activeClassName() {
            return this.activePointIndex === this.index ? ' active' : '';
        },

        pointStyle: function pointStyle() {
            return { left: (((this.point.left * (this.width / 100)) - 6) + "px"), }
        }
    },

    methods: {
        mouseDownHandler: function mouseDownHandler(event) {
            this.changeActivePointIndex(this.index);

            var startX = event.pageX;
            var startY = event.pageY;
            var offsetX = startX - this.positions.x;

            this.updateGradientLeft(this.point.left, this.index, 'onStartChange');

            return {
                startX: startX,
                startY: startY,
                offsetX: offsetX,

            };
        },

        changeObjectPositions: function changeObjectPositions(event, ref) {
            var startX = ref.startX;
            var offsetX = ref.offsetX;

            var moveX = event.pageX - startX;
            offsetX += moveX;
            // update point percent
            var left = updateGradientActivePercent(offsetX, this.width);

            return {
                positions: {
                    offsetX: offsetX,
                    startX: event.pageX,
                },
                left: left,
            };
        },

        mouseMoveHandler: function mouseMoveHandler(event, ref) {
            var startX = ref.startX;
            var offsetX = ref.offsetX;

            var ref$1 = this.changeObjectPositions(event, { startX: startX, offsetX: offsetX });
            var positions = ref$1.positions;
            var left = ref$1.left;

            this.updateGradientLeft(left, this.index, 'onChange');

            return positions;
        },

        mouseUpHandler: function mouseUpHandler(event, ref) {
            var startX = ref.startX;
            var offsetX = ref.offsetX;

            var ref$1 = this.changeObjectPositions(event, { startX: startX, offsetX: offsetX });
            var positions = ref$1.positions;
            var left = ref$1.left;

            this.updateGradientLeft(left, this.index, 'onEndChange');

            return positions;
        },
    }
};

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      class: "picker-pointer" + _vm.activeClassName,
      style: _vm.pointStyle,
      on: {
        mousedown: _vm.mouseEvents,
        dblclick: function() {
          return _vm.removePoint(_vm.index)
        },
        click: function($event) {
          $event.stopPropagation();
        }
      }
    },
    [_c("span", { class: "child-point" + _vm.activeClassName })]
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  var __vue_inject_styles__$4 = undefined;
  /* scoped */
  var __vue_scope_id__$4 = undefined;
  /* module identifier */
  var __vue_module_identifier__$4 = undefined;
  /* functional template */
  var __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$4 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    undefined,
    undefined,
    undefined
  );

var script$5 = {
    name: "index",

    props: {
        points: Array,
        activePointIndex: Number,
        changeActivePointIndex: Function,
        updateGradientLeft: Function,
        addPoint: Function,
        removePoint: Function,
    },

    data: function data() {
        return {
            width: 0,
            positions: { x: 0, y: 0 }
        }
    },

    components: {
        GradientPoint: __vue_component__$4
    },

    mounted: function mounted() {
        var pointer = this.$refs.pointsContainerRef;

        if (pointer) {
            this.width = pointer.clientWidth;

            var pointerPos = pointer.getBoundingClientRect();

            this.positions = { x: pointerPos.x, y: pointerPos.y };
        }
    },

    computed: {
        pointsStyle: function pointsStyle() {
            var style = generateGradientStyle(this.points, 'linear', 90);

            return { background: style };
        }
    },

    methods: {
        pointsContainerClick: function pointsContainerClick(event) {
            var left = updateGradientActivePercent(event.pageX - this.positions.x, this.width);

            this.addPoint(left);
        },
    }
};

/* script */
var __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      staticClass: "gradient-slider",
      style: _vm.pointsStyle,
      on: { click: _vm.pointsContainerClick }
    },
    [
      _c(
        "div",
        { ref: "pointsContainerRef", staticClass: "gradient-slider-container" },
        _vm._l(_vm.points, function(point, index) {
          return _c("GradientPoint", {
            key: index,
            attrs: {
              activePointIndex: _vm.activePointIndex,
              index: index,
              point: point,
              width: _vm.width,
              positions: _vm.positions,
              changeActivePointIndex: _vm.changeActivePointIndex,
              updateGradientLeft: _vm.updateGradientLeft,
              removePoint: _vm.removePoint
            }
          })
        }),
        1
      )
    ]
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  var __vue_inject_styles__$5 = undefined;
  /* scoped */
  var __vue_scope_id__$5 = undefined;
  /* module identifier */
  var __vue_module_identifier__$5 = undefined;
  /* functional template */
  var __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$5 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    undefined,
    undefined,
    undefined
  );

var script$6 = {
    name: "Input",

    props: {
        value: {
            type: String | Number,
            default: '',
        },
        label: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text'
        },
        classes: {
            type: String,
            default: ''
        },
        onFocus: {
            type: Function,
            default: function () {
            }
        },
        onBlur: {
            type: Function,
            default: function () {
            }
        },
    },

    model: {
        prop: "value",
        event: "input"
    }
};

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
var __vue_script__$6 = script$6;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: "input-field " + _vm.classes }, [
    _c("div", { staticClass: "input-container" }, [
      _c("input", {
        class: _vm.type + "-input input",
        domProps: { value: _vm.value },
        on: {
          focus: _vm.onFocus,
          blur: _vm.onBlur,
          input: function($event) {
            return _vm.$emit("input", $event)
          },
          keyup: function($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
            ) {
              return null
            }
            return _vm.onBlur($event)
          }
        }
      })
    ]),
    _vm._v(" "),
    _vm.label
      ? _c("div", { staticClass: "label" }, [
          _vm._v("\n        " + _vm._s(_vm.label) + "\n    ")
        ])
      : _vm._e()
  ])
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  var __vue_inject_styles__$6 = function (inject) {
    if (!inject) { return }
    inject("data-v-512be964_0", { source: ".input-field {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n}\n.input-field + .input-field {\n  margin-left: 14px;\n}\n.input-field .label {\n  font-size: 12px;\n  line-height: 15px;\n  font-weight: 600;\n  margin-top: 6px;\n  margin-bottom: 0;\n  color: #1F2667;\n}\n.input-field .input-container {\n  display: flex;\n  align-items: center;\n  position: relative;\n  width: 100%;\n  color: #333;\n}\n.input-field .input-container .input {\n  width: 100%;\n  outline: 0;\n  text-align: center;\n  color: #333;\n  border: 0;\n  border-bottom: 1px solid #333;\n  height: 18px;\n  font-size: 12px;\n  padding: 0 1px;\n}\n", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$6 = undefined;
  /* module identifier */
  var __vue_module_identifier__$6 = undefined;
  /* functional template */
  var __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$6 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    createInjector,
    undefined,
    undefined
  );

var script$7 = {
    name: "Area",

    props: {
        isGradient: Boolean,
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        hue: Number,
        saturation: Number,
        value: Number,
        updateColor: Function,
        points: Array,
        degree: Number,
        type: String,
        activePointIndex: Number,
        changeGradientControl: Function,
        changeActivePointIndex: Function,
        updateGradientLeft: Function,
        addPoint: Function,
        removePoint: Function,
    },

    components: {
        Picker: __vue_component__,
        GradientPoints: __vue_component__$5,
        Preview: __vue_component__$1,
        Hue: __vue_component__$2,
        Alpha: __vue_component__$3,
        Input: __vue_component__$6
    },

    data: function data() {
        return {
            degreeValue: this.degree + '°'
        }
    },

    methods: {
        onFocus: function onFocus() {
            this.degreeValue = String(this.degreeValue).replace(/°/, '');
        },

        onBlur: function onBlur() {
            this.updateColor({
                degree: this.degreeValue
            });
            this.degreeValue = parseInt(this.degreeValue, 10) + '°';
        },

        changeDegree: function changeDegree(event) {
            var value = +event.target.value;
            if (Number.isNaN(value) || value < 0 || value > 360) {
                this.degreeValue = 0;
                return;
            }
            this.degreeValue = value;
        }
    }
};

/* script */
var __vue_script__$7 = script$7;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", [
    _vm.isGradient
      ? _c(
          "div",
          { staticClass: "gradient-control" },
          [
            _c("GradientPoints", {
              attrs: {
                type: _vm.type,
                degree: _vm.degree,
                points: _vm.points,
                activePointIndex: _vm.activePointIndex,
                changeActivePointIndex: _vm.changeActivePointIndex,
                updateGradientLeft: _vm.updateGradientLeft,
                addPoint: _vm.addPoint,
                removePoint: _vm.removePoint
              }
            }),
            _vm._v(" "),
            _vm.type === "linear"
              ? _c("Input", {
                  attrs: {
                    value: _vm.degreeValue,
                    onFocus: _vm.onFocus,
                    onBlur: _vm.onBlur
                  },
                  on: { input: _vm.changeDegree }
                })
              : _vm._e()
          ],
          1
        )
      : _vm._e(),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "picker-area" },
      [
        _c("Picker", {
          attrs: {
            red: _vm.red,
            green: _vm.green,
            blue: _vm.blue,
            hue: _vm.hue,
            saturation: _vm.saturation,
            value: _vm.value,
            updateColor: _vm.updateColor
          }
        }),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "preview" },
          [
            _c("Preview", {
              attrs: {
                red: _vm.red,
                green: _vm.green,
                blue: _vm.blue,
                alpha: _vm.alpha,
                isGradient: _vm.isGradient,
                points: _vm.points,
                gradientDegree: _vm.degree,
                gradientType: _vm.type
              }
            }),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "color-hue-alpha" },
              [
                _c("Hue", {
                  attrs: {
                    hue: _vm.hue,
                    saturation: _vm.saturation,
                    value: _vm.value,
                    updateColor: _vm.updateColor
                  }
                }),
                _vm._v(" "),
                _c("Alpha", {
                  attrs: {
                    alpha: _vm.alpha,
                    red: _vm.red,
                    green: _vm.green,
                    blue: _vm.blue,
                    updateColor: _vm.updateColor
                  }
                })
              ],
              1
            )
          ],
          1
        )
      ],
      1
    )
  ])
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  var __vue_inject_styles__$7 = undefined;
  /* scoped */
  var __vue_scope_id__$7 = undefined;
  /* module identifier */
  var __vue_module_identifier__$7 = undefined;
  /* functional template */
  var __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$7 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    false,
    undefined,
    undefined,
    undefined
  );

var script$8 = {
    name: "Preview",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        max: Number,
        updateColor: Function,
    },

    components: {
        Input: __vue_component__$6
    },

    data: function data() {
        return {
            inProgress: false,
            hexValue: '#' + rgbToHex(this.red, this.green, this.blue),
            alphaValue: (parseInt(this.alpha * 100, 10) || 100) + '%'
        }
    },

    computed: {
        hex: function hex() {
            return rgbToHex(this.red, this.green, this.blue)
        }
    },

    watch: {
        inProgress: "setHex",
        red: "setHex",
        green: "setHex",
        blue: "setHex",
        alpha: "setAlpha",
    },

    methods: {
        setHex: function setHex() {
            if (this.inProgress) {
                return;
            }

            this.hexValue = '#' + this.hex;
        },

        setAlpha: function setAlpha() {
            this.alphaValue = (parseInt(this.alpha * 100, 10) || 100) + '%';
        },

        changeHex: function changeHex(event) {
            var color = hexToRgb(event.target.value);

            if (color) {
                this.updateColor(Object.assign({}, color, 
                    {alpha: Number((parseFloat(this.alphaValue) / 100).toFixed(2))}));
            }
        },

        onFocus: function onFocus() {
            this.inProgress = true;
            this.alphaValue = String(this.alphaValue).replace(/%/, '');
        },

        onBlur: function onBlur() {
            this.inProgress = false;
            this.updateColor({
                alpha: Number((parseFloat(this.alphaValue) / 100).toFixed(2))
            });
            this.alphaValue = parseInt(this.alphaValue, 10) + '%';
        },

        changeAlpha: function changeAlpha(event) {
            var value = +event.target.value;
            if (Number.isNaN(value) || value.length > 3 || value < 0 || value > 255 || (this.max && (value > this.max))) {
                this.alphaValue = 100;
                return;
            }
            this.alphaValue = value;
        }
    }
};

/* script */
var __vue_script__$8 = script$8;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "fragment",
    [
      _c("Input", {
        attrs: {
          value: _vm.hexValue,
          onFocus: function() {
            return (_vm.inProgress = true)
          },
          onBlur: function() {
            return (_vm.inProgress = false)
          },
          inProgress: _vm.inProgress,
          classes: "hex"
        },
        on: { input: _vm.changeHex }
      }),
      _vm._v(" "),
      _c("Input", {
        staticStyle: { width: "50px" },
        attrs: {
          value: _vm.alphaValue,
          type: "number",
          max: 100,
          onFocus: _vm.onFocus,
          onBlur: _vm.onBlur,
          inProgress: _vm.inProgress
        },
        on: { input: _vm.changeAlpha }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  var __vue_inject_styles__$8 = undefined;
  /* scoped */
  var __vue_scope_id__$8 = undefined;
  /* module identifier */
  var __vue_module_identifier__$8 = undefined;
  /* functional template */
  var __vue_is_functional_template__$8 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$8 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    false,
    undefined,
    undefined,
    undefined
  );

var script$9 = {
    name: "RGBItem",

    props: {
        value: String | Number,
        type: String,
        label: String,
        suffix: String,
        max: Number,
        onChange: Function,
    },

    components: {
        Input: __vue_component__$6
    },

    data: function data() {
        return {
            inputValue: this.suffix ? this.value + this.suffix : this.value,
            inProgress: false
        }
    },

    watch: {
        value: "setValue"
    },

    methods: {
        onChangeHandler: function onChangeHandler(event) {
            var value = +event.target.value;

            if (Number.isNaN(value) || value.length > 3 || value < 0 || value > 255 || (this.max && value > this.max)) {
                this.inputValue = this.value;

                this.$forceUpdate();

                return;
            }

            this.inputValue = event.target.value;

            this.onChange(value);
        },

        onFocus: function onFocus() {
            this.inProgress = true;
            if(this.suffix) {
                this.inputValue = String(this.inputValue).replace(new RegExp(this.suffix), '');
            }
        },

        onBlur: function onBlur() {
            if (!this.inputValue && !this.inputValue !== 0) {
                this.inputValue = this.value;
            }

            if(this.suffix) {
                this.inputValue += this.suffix;
            }

            this.inProgress = false;
        },

        setValue: function setValue() {
            if (this.value !== +this.inputValue && this.inputValue !== '') {
                this.inputValue = this.value;
            }
            if(this.suffix && this.inProgress === false) {
                this.inputValue += this.suffix;
            }
        }
    }
};

/* script */
var __vue_script__$9 = script$9;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("Input", {
    attrs: {
      value: _vm.inputValue,
      type: _vm.type,
      label: _vm.label,
      onFocus: _vm.onFocus,
      onBlur: _vm.onBlur,
      inProgress: _vm.inProgress,
      classes: "rgb"
    },
    on: { input: _vm.onChangeHandler }
  })
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  var __vue_inject_styles__$9 = function (inject) {
    if (!inject) { return }
    inject("data-v-44d161e5_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"index.vue"}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$9 = "data-v-44d161e5";
  /* module identifier */
  var __vue_module_identifier__$9 = undefined;
  /* functional template */
  var __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$9 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    false,
    createInjector,
    undefined,
    undefined
  );

var script$a = {
    name: "RGB",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        updateColor: Function,
    },

    components: {
        RGBItem: __vue_component__$9
    },

    methods: {
        changeValue: function changeValue(field, value) {
            var obj, obj$1;

            if (field === 'alpha') {
                this.updateColor({ alpha: value / 100 });

                return;
            }

            var color = rgbToHSv(( obj = {
                red: this.red, green: this.green, blue: this.blue
            }, obj[field] = value, obj ));

            this.updateColor(Object.assign({}, color, ( obj$1 = {}, obj$1[field] = value, obj$1 )));
        },
    }
};

/* script */
var __vue_script__$a = script$a;

/* template */
var __vue_render__$a = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "fragment",
    [
      _c("RGBItem", {
        attrs: {
          value: _vm.red,
          type: "number",
          onChange: function(value) {
            return _vm.changeValue("red", value)
          }
        }
      }),
      _vm._v(" "),
      _c("RGBItem", {
        attrs: {
          value: _vm.green,
          type: "number",
          onChange: function(value) {
            return _vm.changeValue("green", value)
          }
        }
      }),
      _vm._v(" "),
      _c("RGBItem", {
        attrs: {
          value: _vm.blue,
          type: "number",
          onChange: function(value) {
            return _vm.changeValue("blue", value)
          }
        }
      }),
      _vm._v(" "),
      _c("RGBItem", {
        staticClass: "alpha-input",
        attrs: {
          value: parseInt(_vm.alpha * 100, 10),
          type: "number",
          suffix: "%",
          max: 100,
          onChange: function(value) {
            return _vm.changeValue("alpha", value)
          }
        }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;

  /* style */
  var __vue_inject_styles__$a = function (inject) {
    if (!inject) { return }
    inject("data-v-39c269e8_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"index.vue"}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$a = "data-v-39c269e8";
  /* module identifier */
  var __vue_module_identifier__$a = undefined;
  /* functional template */
  var __vue_is_functional_template__$a = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$a = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    false,
    createInjector,
    undefined,
    undefined
  );

var script$b = {
    name: "Preview",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        points: Array,
        updateColor: Function,
    },

    components: {
        Hex: __vue_component__$8,
        RGB: __vue_component__$a,
    },

    data: function data() {
        return {
            colorMode: 'Hex',
            colorOptions: [
                {value: 'Hex', label: 'Hex'},
                {value: 'RGB', label: 'RGB'} ],
        }
    }
};

/* script */
var __vue_script__$b = script$b;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "color-preview-area" },
    [
      _c(
        "el-select",
        {
          attrs: { size: "mini" },
          model: {
            value: _vm.colorMode,
            callback: function($$v) {
              _vm.colorMode = $$v;
            },
            expression: "colorMode"
          }
        },
        _vm._l(_vm.colorOptions, function(item) {
          return _c("el-option", {
            key: item.value,
            attrs: { label: item.label, value: item.value }
          })
        }),
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "input-group" },
        [
          _vm.colorMode === "Hex"
            ? _c("Hex", {
                attrs: {
                  red: _vm.red,
                  green: _vm.green,
                  blue: _vm.blue,
                  alpha: _vm.alpha,
                  updateColor: _vm.updateColor
                }
              })
            : _c("RGB", {
                attrs: {
                  red: _vm.red,
                  green: _vm.green,
                  blue: _vm.blue,
                  updateColor: _vm.updateColor
                }
              })
        ],
        1
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;

  /* style */
  var __vue_inject_styles__$b = undefined;
  /* scoped */
  var __vue_scope_id__$b = undefined;
  /* module identifier */
  var __vue_module_identifier__$b = undefined;
  /* functional template */
  var __vue_is_functional_template__$b = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$b = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    false,
    undefined,
    undefined,
    undefined
  );

var script$c = {
    name: "Solid",

    props: {
        red: {
            type: Number,
            default: 255
        },
        green: {
            type: Number,
            default: 0
        },
        blue: {
            type: Number,
            default: 0
        },
        alpha: {
            type: Number,
            default: 1
        },
        hue: Number,
        saturation: Number,
        value: Number,
        onStartChange: Function,
        onChange: Function,
        onEndChange: Function,
    },

    components: {
        Area: __vue_component__$7,
        Preview: __vue_component__$b,
    },

    data: function data() {
        return {
            colorRed: this.red,
            colorGreen: this.green,
            colorBlue: this.blue,
            colorAlpha: this.alpha,
            colorHue: 0,
            colorSaturation: 100,
            colorValue: 100,
            actions: {
                onStartChange: this.onStartChange,
                onChange: this.onChange,
                onEndChange: this.onEndChange,
            }

        }
    },

    mounted: function mounted() {
        var ref = rgbToHSv({ red: this.colorRed, green: this.colorGreen, blue: this.colorBlue });
        var hue = ref.hue;
        var saturation = ref.saturation;
        var value = ref.value;

        this.colorHue = hue;
        this.colorSaturation = saturation;
        this.colorValue = value;
        this.updateColor(Object.assign({}, this.$props));
    },

    computed: {
        hsv: function hsv() {
            if (this.hue === undefined || this.saturation === undefined || this.value=== undefined) {
                return rgbToHSv({ red: this.red, green: this.green, blue: this.blue });
            }

            return  {
                hue: this.hue,
                saturation: this.saturation,
                value: this.value,
            }
        },

        color: function color() {
            return {
                red: this.red,
                green: this.green,
                blue: this.blue,
                alpha: this.alpha,

            }
        }
    },

    watch: {
        hsv: function (ref) {
            var hue = ref.hue;
            var saturation = ref.saturation;
            var value = ref.value;

            this.colorHue = hue;
            this.colorSaturation = saturation;
            this.colorValue = value;
        },

        color: function (ref) {
            var red = ref.red;
            var green = ref.green;
            var blue = ref.blue;
            var alpha = ref.alpha;

            this.colorRed = red;
            this.colorGreen = green;
            this.colorBlue = blue;
            this.colorAlpha = alpha;
        },
    },

    methods: {
        updateColor: function updateColor(ref, actionName) {
            var red = ref.red;
            var green = ref.green;
            var blue = ref.blue;
            var alpha = ref.alpha;
            var hue = ref.hue;
            var saturation = ref.saturation;
            var value = ref.value;
            if ( actionName === void 0 ) actionName = 'onChange';

            red = getRightValue(red, this.colorRed);
            green = getRightValue(green, this.colorGreen);
            blue = getRightValue(blue, this.colorBlue);
            alpha = getRightValue(alpha, this.colorAlpha);
            hue = getRightValue(hue, this.colorHue);
            saturation = getRightValue(saturation, this.colorSaturation);
            value = getRightValue(value, this.colorValue);

            this.colorRed = red;
            this.colorGreen = green;
            this.colorBlue = blue;
            this.colorAlpha = alpha;
            this.colorHue = hue;
            this.colorSaturation = saturation;
            this.colorValue = value;

            var action = this.actions[actionName];

            action && action({
                red: red,
                green: green,
                blue: blue,
                alpha: alpha,
                hue: hue,
                saturation: saturation,
                value: value,
                style: generateSolidStyle(red, green, blue, alpha),
            });
        },
    }
};

/* script */
var __vue_script__$c = script$c;

/* template */
var __vue_render__$c = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "fragment",
    [
      _c("Area", {
        attrs: {
          red: _vm.colorRed,
          green: _vm.colorGreen,
          blue: _vm.colorBlue,
          alpha: _vm.colorAlpha,
          hue: _vm.colorHue,
          saturation: _vm.colorSaturation,
          value: _vm.colorValue,
          updateColor: _vm.updateColor,
          "is-gradient": false
        }
      }),
      _vm._v(" "),
      _c("Preview", {
        attrs: {
          red: _vm.colorRed,
          green: _vm.colorGreen,
          blue: _vm.colorBlue,
          alpha: _vm.colorAlpha,
          updateColor: _vm.updateColor
        }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$c = [];
__vue_render__$c._withStripped = true;

  /* style */
  var __vue_inject_styles__$c = undefined;
  /* scoped */
  var __vue_scope_id__$c = undefined;
  /* module identifier */
  var __vue_module_identifier__$c = undefined;
  /* functional template */
  var __vue_is_functional_template__$c = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$c = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
    false,
    undefined,
    undefined,
    undefined
  );

var script$d = {
    name: "GradientControls",

    props: {
        type: String,
        degree: Number,
        changeGradientControl: {
            type: Function,
            default: function () {}
        }
    },
    data: function data() {
        return {
            disableClick: false,
            mouseEvents: function () {},
        }
    },

    mounted: function mounted() {
        this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },

    computed: {
        degreesStyle: function degreesStyle() {
            return { transform: ("rotate(" + (this.degree) + "deg)") };
        }
    },

    methods: {
        mouseDownHandler: function mouseDownHandler(event) {
            var pointer = event.target;
            var pointerBox = pointer.getBoundingClientRect();
            var centerY = pointerBox.top + parseInt(8 - window.pageYOffset, 10);
            var centerX = pointerBox.left + parseInt(8 - window.pageXOffset, 10);

            return {
                centerY: centerY,
                centerX: centerX,

            };
        },

        mouseMoveHandler: function mouseMoveHandler(event, ref) {
            var centerX = ref.centerX;
            var centerY = ref.centerY;

            this.disableClick = true;

            var newDegree = calculateDegree(event.clientX, event.clientY, centerX, centerY);

            this.changeGradientControl({ degree: parseInt(newDegree, 10) });
        },

        mouseUpHandler: function mouseUpHandler(event) {
            var targetClasses = event.target.classList;

            if (targetClasses.contains('gradient-degrees') || targetClasses.contains('icon-rotate')) {
                return;
            }

            this.disableClick = false;
        },

        onClickGradientDegree: function onClickGradientDegree() {
            if (this.disableClick) {
                this.disableClick = false;
                return;
            }

            var gradientDegree = this.degree + 45;

            if (gradientDegree >= 360) {
                gradientDegree = 0;
            }

            this.changeGradientControl({ degree: parseInt(gradientDegree, 10) });
        }
    }
};

/* script */
var __vue_script__$d = script$d;

/* template */
var __vue_render__$d = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "gradient-controls" }, [
    _c("div", { staticClass: "gradient-type" }, [
      _c("div", {
        class:
          "gradient-type-item liner-gradient " +
          (_vm.type === "linear" ? "active" : ""),
        on: {
          click: function() {
            return _vm.changeGradientControl({ type: "linear" })
          }
        }
      }),
      _vm._v(" "),
      _c("div", {
        class:
          "gradient-type-item radial-gradient " +
          (_vm.type === "radial" ? "active" : ""),
        on: {
          click: function() {
            return _vm.changeGradientControl({ type: "radial" })
          }
        }
      })
    ]),
    _vm._v(" "),
    _vm.type === "linear"
      ? _c("div", { staticClass: "gradient-degrees-options" }, [
          _c(
            "div",
            {
              staticClass: "gradient-degrees",
              on: {
                mousedown: _vm.mouseEvents,
                click: _vm.onClickGradientDegree
              }
            },
            [
              _c(
                "div",
                {
                  staticClass: "gradient-degree-center",
                  style: _vm.degreesStyle
                },
                [_c("div", { staticClass: "gradient-degree-pointer" })]
              )
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "gradient-degree-value" }, [
            _c("p", [
              _vm._v(
                "\n                " + _vm._s(_vm.degree) + "°\n            "
              )
            ])
          ])
        ])
      : _vm._e()
  ])
};
var __vue_staticRenderFns__$d = [];
__vue_render__$d._withStripped = true;

  /* style */
  var __vue_inject_styles__$d = undefined;
  /* scoped */
  var __vue_scope_id__$d = undefined;
  /* module identifier */
  var __vue_module_identifier__$d = undefined;
  /* functional template */
  var __vue_is_functional_template__$d = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$d = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d,
    __vue_scope_id__$d,
    __vue_is_functional_template__$d,
    __vue_module_identifier__$d,
    false,
    undefined,
    undefined,
    undefined
  );

var script$e = {
    name: "Gradient",

    props: {
        type: {
            type: String,
            default: 'linear'
        },
        degree: {
            type: Number,
            default: 0
        },
        points: {
            type: Array,
            default: function () {
                return [
                    {
                        left: 0,
                        red: 0,
                        green: 0,
                        blue: 0,
                        alpha: 1,
                    },
                    {
                        left: 100,
                        red: 255,
                        green: 0,
                        blue: 0,
                        alpha: 1,
                    } ];
            }
        },
        onStartChange: Function,
        onChange: Function,
        onEndChange: Function,
    },

    components: {
        GradientControls: __vue_component__$d,
        Area: __vue_component__$7,
        Preview: __vue_component__$b
    },

    data: function data() {
        return {
            activePointIndex: 0,
            gradientPoints: this.points,
            activePoint: this.points[0],
            colorRed: this.points[0].red,
            colorGreen: this.points[0].green,
            colorBlue: this.points[0].blue,
            colorAlpha: this.points[0].alpha,
            colorHue: 0,
            colorSaturation: 100,
            colorValue: 100,
            gradientType: this.type,
            gradientDegree: this.degree,
            actions: {
                onStartChange: this.onStartChange,
                onChange: this.onChange,
                onEndChange: this.onEndChange,
            }
        }
    },

    watch: {
        type: function type(type$1) {
            this.changeGradientControl({type: type$1});
        }
    },

    mounted: function mounted() {
        var ref = rgbToHSv({ red: this.colorRed, green: this.colorGreen, blue: this.colorBlue });
        var hue = ref.hue;
        var saturation = ref.saturation;
        var value = ref.value;

        this.colorHue = hue;
        this.colorSaturation = saturation;
        this.colorValue = value;

        document.addEventListener('keyup', this.keyUpHandler);
    },

    beforeDestroy: function beforeDestroy() {
        document.removeEventListener('keyup', this.keyUpHandler);
    },

    methods: {
        removePoint: function removePoint(index) {
            if ( index === void 0 ) index = this.activePointIndex;

            if (this.gradientPoints.length <= 2) {
                return;
            }

            this.gradientPoints.splice(index, 1);


            if (index > 0) {
                this.activePointIndex = index - 1;
            }

            this.onChange && this.onChange({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: generateGradientStyle(this.gradientPoints, this.gradientType, this.gradientDegree),
            });
        },

        keyUpHandler: function keyUpHandler(event) {
            if(event.target.tagName === 'INPUT') { return }
            if ((event.keyCode === 46 || event.keyCode === 8)) {
                this.removePoint(this.activePointIndex);
            }
        },

        changeActivePointIndex: function changeActivePointIndex(index) {
            this.activePointIndex = index;

            this.activePoint = this.gradientPoints[index];

            var ref = this.activePoint;
            var red = ref.red;
            var green = ref.green;
            var blue = ref.blue;
            var alpha = ref.alpha;

            this.colorRed = red;
            this.colorGreen = green;
            this.colorBlue = blue;
            this.colorAlpha = alpha;

            var ref$1 = rgbToHSv({ red: red, green: green, blue: blue });
            var hue = ref$1.hue;
            var saturation = ref$1.saturation;
            var value = ref$1.value;

            this.colorHue = hue;
            this.colorSaturation = saturation;
            this.colorValue = value;
        },

        changeGradientControl: function changeGradientControl(ref) {
            var type = ref.type;
            var degree = ref.degree;

            type = getRightValue(type, this.gradientType);
            degree = getRightValue(degree, this.gradientDegree);

            this.gradientType = type;
            this.gradientDegree = degree;

            this.onChange({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: generateGradientStyle(this.gradientPoints, this.gradientType, this.gradientDegree),
            });
        },

        updateColor: function updateColor(ref, actionName) {
            var red = ref.red;
            var green = ref.green;
            var blue = ref.blue;
            var alpha = ref.alpha;
            var hue = ref.hue;
            var saturation = ref.saturation;
            var value = ref.value;
            var degree = ref.degree;
            if ( actionName === void 0 ) actionName = 'onChange';

            red = getRightValue(red, this.colorRed);
            green = getRightValue(green, this.colorGreen);
            blue = getRightValue(blue, this.colorBlue);
            alpha = getRightValue(alpha, this.colorAlpha);
            hue = getRightValue(hue, this.colorHue);
            saturation = getRightValue(saturation, this.colorSaturation);
            value = getRightValue(value, this.colorValue);

            var localGradientPoints = this.gradientPoints.slice();

            localGradientPoints[this.activePointIndex] = Object.assign({}, localGradientPoints[this.activePointIndex],
                {red: red,
                green: green,
                blue: blue,
                alpha: alpha});

            this.colorRed = red;
            this.colorGreen = green;
            this.colorBlue = blue;
            this.colorAlpha = alpha;
            this.colorHue = hue;
            this.colorSaturation = saturation;
            this.colorValue = value;
            this.gradientPoints = localGradientPoints;
            if(typeof degree !== 'undefined') {
                this.gradientDegree = degree;
            }

            var action = this.actions[actionName];

            action && action({
                points: localGradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: generateGradientStyle(localGradientPoints, this.gradientType, this.gradientDegree),
            });
        },

        updateGradientLeft: function updateGradientLeft(left, index, actionName) {
            if ( actionName === void 0 ) actionName = 'onChange';

            this.gradientPoints[index].left = left;

            var action = this.actions[actionName];

            action && action({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: generateGradientStyle(this.gradientPoints, this.gradientType, this.gradientDegree),
            });
        },

        addPoint: function addPoint(left) {
            this.gradientPoints.push(Object.assign({}, this.gradientPoints[this.activePointIndex],
                {left: left}));

            this.activePointIndex = this.gradientPoints.length - 1;

            this.onChange && this.onChange({
                points: this.gradientPoints,
                type: this.gradientType,
                degree: this.gradientDegree,
                style: generateGradientStyle(this.gradientPoints, this.gradientType, this.gradientDegree),
            });
        },

    }
};

/* script */
var __vue_script__$e = script$e;

/* template */
var __vue_render__$e = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "fragment",
    [
      _c("Area", {
        attrs: {
          red: _vm.colorRed,
          green: _vm.colorGreen,
          blue: _vm.colorBlue,
          alpha: _vm.colorAlpha,
          hue: _vm.colorHue,
          saturation: _vm.colorSaturation,
          value: _vm.colorValue,
          updateColor: _vm.updateColor,
          "is-gradient": true,
          type: _vm.gradientType,
          degree: _vm.gradientDegree,
          points: _vm.gradientPoints,
          activePointIndex: _vm.activePointIndex,
          changeGradientControl: _vm.changeGradientControl,
          changeActivePointIndex: _vm.changeActivePointIndex,
          updateGradientLeft: _vm.updateGradientLeft,
          addPoint: _vm.addPoint,
          removePoint: _vm.removePoint
        }
      }),
      _vm._v(" "),
      _c("Preview", {
        attrs: {
          red: _vm.colorRed,
          green: _vm.colorGreen,
          blue: _vm.colorBlue,
          alpha: _vm.colorAlpha,
          updateColor: _vm.updateColor
        }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$e = [];
__vue_render__$e._withStripped = true;

  /* style */
  var __vue_inject_styles__$e = undefined;
  /* scoped */
  var __vue_scope_id__$e = undefined;
  /* module identifier */
  var __vue_module_identifier__$e = undefined;
  /* functional template */
  var __vue_is_functional_template__$e = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$e = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
    false,
    undefined,
    undefined,
    undefined
  );

Vue.use(vueFragment.Plugin);
Vue.component(elementUi.Select.name, elementUi.Select);
Vue.component(elementUi.Option.name, elementUi.Option);

var script$f = {
    name: "ColorPicker",

    props: {
        color: {
            type: Object,
            default: function () { return ({
                red: 255,
                green: 0,
                blue: 0,
                alpha: 1,
                hue: 0,
                saturation: 100,
                value: 100,
            }); }
        },
        onStartChange: {
            type: Function,
            default: function () {}
        },
        onChange: {
            type: Function,
            default: function () {}
        },
        onEndChange: {
            type: Function,
            default: function () {}
        },
    },

    components: {
        Solid: __vue_component__$c,
        Gradient: __vue_component__$e,
    },

    data: function data() {
        return {
            isGradient: false,
            colorMode: 'solid',
            colorOptions: [
                {value: 'solid', label: 'Solid color'},
                {value: 'linear', label: 'Linear gradient'},
                {value: 'radial', label: 'Radial gradient'} ],
            gradient: {
                type: 'linear',
                degree: 0,
                points: [
                    {
                        left: 0,
                        red: 0,
                        green: 0,
                        blue: 0,
                        alpha: 1,
                    },
                    {
                        left: 100,
                        red: 255,
                        green: 0,
                        blue: 0,
                        alpha: 1,
                    } ],
            },
        }
    },

    created: function created() {
        this.init();
    },

    methods: {
        init: function init() {
            if(this.color.type) {
                this.gradient = Object.assign({}, this.color);
                this.colorMode = this.color.type;
                this.isGradient = true;
            }
        },
        t: function t(text) {
            return this.$t ? this.$t(text) : text
        },
        onColorTypeChange: function onColorTypeChange(type) {
            var this$1 = this;

            this.isGradient = false;
            this.$nextTick().then(function (){
                if(type === 'solid') {
                    return this$1.isGradient = false
                }
                this$1.isGradient = true;
                this$1.gradient = Object.assign({}, this$1.gradient,
                    {type: type});
            });
        }
    }
};

/* script */
var __vue_script__$f = script$f;

/* template */
var __vue_render__$f = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "ui-color-picker" },
    [
      _c(
        "el-select",
        {
          attrs: { size: "mini" },
          on: { change: _vm.onColorTypeChange },
          model: {
            value: _vm.colorMode,
            callback: function($$v) {
              _vm.colorMode = $$v;
            },
            expression: "colorMode"
          }
        },
        _vm._l(_vm.colorOptions, function(item) {
          return _c("el-option", {
            key: item.value,
            attrs: { label: _vm.t(item.label), value: item.value }
          })
        }),
        1
      ),
      _vm._v(" "),
      _vm.isGradient
        ? _c("Gradient", {
            attrs: {
              points: _vm.gradient.points,
              type: _vm.gradient.type,
              degree: _vm.gradient.degree,
              onChange: _vm.onChange,
              onStartChange: _vm.onStartChange,
              onEndChange: _vm.onEndChange
            }
          })
        : _c("Solid", {
            attrs: {
              red: _vm.color.red,
              green: _vm.color.green,
              blue: _vm.color.blue,
              alpha: _vm.color.alpha,
              hue: _vm.color.hue,
              saturation: _vm.color.saturation,
              value: _vm.color.value,
              onChange: _vm.onChange,
              onStartChange: _vm.onStartChange,
              onEndChange: _vm.onEndChange
            }
          })
    ],
    1
  )
};
var __vue_staticRenderFns__$f = [];
__vue_render__$f._withStripped = true;

  /* style */
  var __vue_inject_styles__$f = undefined;
  /* scoped */
  var __vue_scope_id__$f = undefined;
  /* module identifier */
  var __vue_module_identifier__$f = undefined;
  /* functional template */
  var __vue_is_functional_template__$f = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$f = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
    false,
    undefined,
    undefined,
    undefined
  );

exports.ColorPicker = __vue_component__$f;
//# sourceMappingURL=index-cjs.js.map
