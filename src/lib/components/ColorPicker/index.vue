<template>
    <div class="ui-color-picker">
        <el-select 
            v-model="colorMode" 
            size="mini"
            @change="onColorTypeChange"
        >
            <el-option
            v-for="item in colorOptions"
            :key="item.value"
            :label="t(item.label)"
            :value="item.value">
            </el-option>
        </el-select>
        <Gradient
            v-if="isGradient"
            :points="gradient.points"
            :type="gradient.type"
            :degree="gradient.degree"
            :onChange="onChange"
            :onStartChange="onStartChange"
            :onEndChange="onEndChange"
        />

        <Solid
            v-else
            :red="color.red"
            :green="color.green"
            :blue="color.blue"
            :alpha="color.alpha"
            :hue="color.hue"
            :saturation="color.saturation"
            :value="color.value"
            :onChange="onChange"
            :onStartChange="onStartChange"
            :onEndChange="onEndChange"
        />
    </div>
</template>

<script src="./script.js" />
