<template>
    <div class="color-preview-area">
        <el-select v-model="colorMode" size="mini">
            <el-option
                v-for="item in colorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <div class="input-group">
            <Hex
                v-if="colorMode === 'Hex'"
                :red="red"
                :green="green"
                :blue="blue"
                :alpha="alpha"
                :updateColor="updateColor"
            />
            <RGB
                v-else
                :red="red"
                :green="green"
                :blue="blue"
                :alpha="alpha"
                :updateColor="updateColor"
            />
        </div>
    </div>
</template>

<script src="./script.js" />
