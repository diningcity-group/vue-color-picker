<template>
  <div id="app">
    <div class="picker-dialog">
      <ColorPicker
        :color="color"
        :onStartChange="(color) => onChange(color, 'start')"
        :onChange="(color) => onChange(color, 'change')"
        :onEndChange="(color) => onChange(color, 'end')"
      />
    </div>
    <h2>demo</h2>
    {{ color }}
    <div class="demo" :style="style"></div>
  </div>
</template>

<script>
import { ColorPicker } from "./lib";

export default {
  name: "App",
  components: {
    ColorPicker,
  },

  data() {
    return {
      color: {red: 186, green: 68, blue: 68, alpha: 1} || {
        points: [
          { left: 0, red: 186, green: 68, blue: 68, alpha: 1 },
          { left: 100, red: 255, green: 0, blue: 0, alpha: 1 },
          { left: 42.857142857142854, red: 186, green: 68, blue: 68, alpha: 1 },
        ],
        type: "linear",
        degree: 0,
        style:
          "linear-gradient(0deg,rgba(186, 68, 68, 1) 0%,rgba(186, 68, 68, 1) 42.857142857142854%,rgba(255, 0, 0, 1) 100%)",
      },
    };
  },

  computed: {
    style() {
      return `background: ${this.color.style}`;
    },
  },

  methods: {
    onChange(attrs) {
      this.color = { ...attrs };
    },
  },
};
</script>

<style lang="less">
body {
  margin: 0;
}
.picker-dialog {
  width: 254px;
  box-sizing: border-box;
}
.demo {
  margin: 20px;
  border: 1px solid #e6e6e6;
  width: 100px;
  height: 100px;
}
</style>
