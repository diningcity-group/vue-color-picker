<template>
<div>
    <div class="gradient-control" v-if="isGradient">
        <GradientPoints
            :type="type"
            :degree="degree"
            :points="points"
            :activePointIndex="activePointIndex"
            :changeActivePointIndex="changeActivePointIndex"
            :updateGradientLeft="updateGradientLeft"
            :addPoint="addPoint"
            :removePoint="removePoint"
        />
        <Input
            v-if="type === 'linear'"
            :value="degreeValue"
            @input="changeDegree"
            :onFocus="onFocus"
            :onBlur="onBlur"
        />
    </div>
    <div class="picker-area">
        <Picker
            :red="red"
            :green="green"
            :blue="blue"
            :hue="hue"
            :saturation="saturation"
            :value="value"
            :updateColor="updateColor"
        />

        <div class="preview">
            <Preview
                :red="red"
                :green="green"
                :blue="blue"
                :alpha="alpha"
                :isGradient="isGradient"
                :points="points"
                :gradientDegree="degree"
                :gradientType="type"
            />

            <div class="color-hue-alpha">
                <Hue
                    :hue="hue"
                    :saturation="saturation"
                    :value="value"
                    :updateColor="updateColor"
                />
                <Alpha
                    :alpha="alpha"
                    :red="red"
                    :green="green"
                    :blue="blue"
                    :updateColor="updateColor"
                />
            </div>
        </div>
    </div>
</div>
</template>

<script src="./script.js" />
