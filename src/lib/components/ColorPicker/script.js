import Vue from 'vue';
import { Plugin } from "vue-fragment";
import { Select, Option } from 'element-ui';
import Solid from './Solid';
import Gradient from './Gradient';

Vue.use(Plugin);
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)

export default {
    name: "ColorPicker",

    props: {
        color: {
            type: Object,
            default: () => ({
                red: 255,
                green: 0,
                blue: 0,
                alpha: 1,
                hue: 0,
                saturation: 100,
                value: 100,
            })
        },
        onStartChange: {
            type: Function,
            default: () => {}
        },
        onChange: {
            type: Function,
            default: () => {}
        },
        onEndChange: {
            type: Function,
            default: () => {}
        },
    },

    components: {
        Solid,
        Gradient,
    },

    data() {
        return {
            isGradient: false,
            colorMode: 'solid',
            colorOptions: [
                {value: 'solid', label: 'Solid color'},
                {value: 'linear', label: 'Linear gradient'},
                {value: 'radial', label: 'Radial gradient'},
            ],
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
                    },
                ],
            },
        }
    },

    created() {
        this.init()
    },

    methods: {
        init() {
            if(this.color.type) {
                this.gradient = {...this.color};
                this.colorMode = this.color.type;
                this.isGradient = true;
            }
        },
        t(text) {
            return this.$t ? this.$t(text) : text
        },
        onColorTypeChange(type) {
            this.isGradient = false
            this.$nextTick().then(()=> {
                if(type === 'solid') {
                    return this.isGradient = false
                }
                this.isGradient = true
                this.gradient = {
                    ...this.gradient,
                    type,
                }
            })
        }
    }
};
