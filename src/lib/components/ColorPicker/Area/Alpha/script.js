import { getAlpha } from "@/lib/helpers";
import { useMouseEvents } from "@/lib/hooks";

export default {
    name: "alpha",

    props: {
        red: Number,
        green: Number,
        blue: Number,
        alpha: Number,
        updateColor: Function,
    },

    data() {
        return {
            height: 0,
            mouseEvents: () => {},
        }
    },

    mounted() {
        const { alphaMaskRef } = this.$refs;

        if (alphaMaskRef) {
            this.height = alphaMaskRef.clientHeight;
        }

        this.mouseEvents = useMouseEvents(this.mouseDownHandler, this.mouseMoveHandler, this.mouseUpHandler);
    },

    computed: {
        offsetTop() {
            return ((this.alpha * this.height) | 0) - 6;
        },

        pointerStyle() {
            return {top: `${this.offsetTop}px`,}
        },

        style() {
            return {
                background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(${this.red}, ${this.green}, ${this.blue}))`,
            }
        }
    },

    methods: {
        mouseDownHandler(event) {
            const elementY = event.currentTarget.getBoundingClientRect().y;
            const startY = event.pageY;
            const positionY = startY - elementY;

            this.updateColor({ alpha: getAlpha(positionY, this.height) }, 'onStartChange');

            return {
                startY,
                positionY,

            };
        },

        changeObjectPositions(event, { startY, positionY }) {
            const moveY = event.pageY - startY;
            positionY += moveY;

            const alpha = getAlpha(positionY, this.height);

            return {
                positions: {
                    positionY,
                    startY: event.pageY,
                },
                alpha,
            };
        },

        mouseMoveHandler(event, { startY, positionY }) {
            const { positions, alpha } = this.changeObjectPositions(event, { startY, positionY });

            this.updateColor({ alpha }, 'onChange');

            return positions;
        },

        mouseUpHandler(event, { startY, positionY, }) {
            const { positions, alpha } = this.changeObjectPositions(event, { startY, positionY });

            this.updateColor({ alpha }, 'onEndChange');

            return positions;
        },
    }
}
