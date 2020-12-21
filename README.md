- [English](https://github.com/diningcity-group/vue-color-picker/blob/main/README.md#welcome-to-the-vue-color-picker) 
- [Chinese Simplified / 中文](https://github.com/diningcity-group/vue-color-picker/blob/main/README.md#%E6%AC%A2%E8%BF%8E%E4%BD%BF%E7%94%A8-vue-color-picker)

# Welcome to the Vue Color Picker

This repository is a fork of the awesome [Vue Color Gradient Picker](https://github.com/arthay/vue-color-gradient-picker).

This color picker takes the same features as the previous picker, but with an updated user experience.

# Table of contents

- [Installing and running](https://github.com/diningcity-group/vue-color-picker/blob/main/README.md#installing-and-running)
- [Pre-setting colors]()

## Installing and running 

To install from the command line:

````shell
npm install vue-color-picker@https://github.com/diningcity-group/vue-color-picker.git#0.1.1
````

To add & use the component:

````vue
<template>
  <ColorPicker :color="color" :onEndChange="onChange" />
</template>
<script>
import { ColorPicker } from "vue-color-picker";

export default {
  components: {
    ColorPicker,
  },
  data() {
    return {
      color: {}
    }
  },
  methods: {
    onChange(color) {
      this.color = color;
    }
  }
}
</script>
````

## Pre-setting colors




# 欢迎使用 Vue Color Picker

这个仓库是很棒的 [Vue Color Gradient Picker](https://github.com/arthay/vue-color-gradient-picker) 的分支。

此颜色选择器具有与@arthay的选择器相同的功能，但具有更新的用户体验。

# 目录

- [安装和运行](https://github.com/diningcity-group/vue-color-picker/blob/main/README.md#%E5%AE%89%E8%A3%85%E5%92%8C%E8%BF%90%E8%A1%8C)
- [预设颜色值](https://github.com/diningcity-group/vue-color-picker#%E9%A2%84%E8%AE%BE%E9%A2%9C%E8%89%B2%E5%80%BC)

## 安装和运行

从命令行安装
````shell
npm install vue-color-picker@https://github.com/diningcity-group/vue-color-picker.git#0.1.1
````

在组件中引入
````vue
<template>
  <ColorPicker :color="color" :onEndChange="onChange" />
</template>
<script>
import { ColorPicker } from "vue-color-picker";

export default {
  components: {
    ColorPicker,
  },
  data() {
    return {
      color: {}
    }
  },
  methods: {
    onChange(color) {
      this.color = color;
    }
  }
}
</script>
````

## 预设颜色值

可以通过 `color` 属性传入预设的演示值， `color` 是一个json格式的对象，如果是单色值，需要符合以下格式:
````js
{
  red: 255,
  green: 0,
  blue: 0,
  alpha: 1,
}
````

如果是渐变色值，需要符合以下格式，这个格式是组件自动生成的:
````js
{
  points: [
    { left: 0, red: 186, green: 68, blue: 68, alpha: 1 },
    { left: 100, red: 255, green: 0, blue: 0, alpha: 1 },
    { left: 42, red: 186, green: 68, blue: 68, alpha: 1 },
  ],
  type: "linear",
  degree: 0,
}
````
