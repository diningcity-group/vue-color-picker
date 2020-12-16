import { Input } from "@/lib/components/UI";

import { rgbToHex, hexToRgb } from "@/lib/helpers";

export default {
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
        Input
    },

    data() {
        return {
            inProgress: false,
            hexValue: '#' + rgbToHex(this.red, this.green, this.blue),
            alphaValue: (parseInt(this.alpha * 100, 10) || 100) + '%'
        }
    },

    computed: {
        hex() {
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
        setHex() {
            if (this.inProgress) {
                return;
            }

            this.hexValue = '#' + this.hex;
        },

        setAlpha() {
            this.alphaValue = (parseInt(this.alpha * 100, 10) || 100) + '%'
        },

        changeHex(event) {
            const color = hexToRgb(event.target.value);

            if (color) {
                this.updateColor({
                    ...color, 
                    alpha: Number((parseFloat(this.alphaValue) / 100).toFixed(2))
                });
            }
        },

        onFocus() {
            this.inProgress = true
            this.alphaValue = String(this.alphaValue).replace(/%/, '')
        },

        onBlur() {
            this.inProgress = false
            this.updateColor({
                alpha: Number((parseFloat(this.alphaValue) / 100).toFixed(2))
            });
            this.alphaValue = parseInt(this.alphaValue, 10) + '%'
        },

        changeAlpha(event) {
            const value = +event.target.value;
            if (Number.isNaN(value) || value.length > 3 || value < 0 || value > 255 || (this.max && (value > this.max))) {
                this.alphaValue = 100
                return;
            }
            this.alphaValue = value;
        }
    }
};
