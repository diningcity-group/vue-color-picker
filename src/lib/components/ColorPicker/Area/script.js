import Picker from "./Picker";
import Preview from "./Preview";
import Hue from "./Hue";
import Alpha from "./Alpha";
import GradientPoints from "./GradientPoints";
import Input from "../../UI/Input";

export default {
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
        Picker,
        GradientPoints,
        Preview,
        Hue,
        Alpha,
        Input
    },

    data() {
        return {
            degreeValue: parseInt(this.degree, 10) + '°'
        }
    },

    methods: {
        onFocus() {
            this.degreeValue = parseInt(this.degreeValue, 10)
        },

        onBlur() {
            this.updateColor({
                degree: parseInt(this.degreeValue, 10)
            });
            this.degreeValue = parseInt(this.degreeValue, 10) + '°'
        },

        changeDegree(event) {
            const value = +event.target.value;
            if (Number.isNaN(value) || value < 0 || value > 360) {
                this.degreeValue = 0
                return;
            }
            this.degreeValue = value;
        }
    }
}
