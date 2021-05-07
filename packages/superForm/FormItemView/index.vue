<template>
    <div class="select-block app-el-form-item" :style="styles" v-bind="$attrs">
        <template v-if="!value">
            <span class="placeholder">{{ placeholder }}</span>
        </template>
        <span class="content" :title="value">{{ value }}</span>
        <span v-if="icon" :class="{ 'icon-select': true, disabled: disabled }" @click="handleOpen">
            <span :class="icon" />
        </span>
    </div>
</template>
<script>
    export default {
        name: 'FormItemView',
        props: {
            value: {
                type: String,
                default: () => '',
            },
            placeholder: {
                type: String,
                default: () => '请选择',
            },
            selecting: {
                type: Boolean,
                default: () => false,
            },
            authKey: {
                type: Array,
                default: () => [],
            },
            styles: {
                type: Object,
                default: () => {},
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            icon: {
                type: String,
                default: 'el-icon-setting',
            },
        },
        methods: {
            handleOpen() {
                this.$emit('click');
            },
        },
    };
</script>
<style lang="scss" scoped>
    .select-block {
        line-height: 28px;
        width: 100%;
        height: 32px;
        font-size: 12px;
        padding-left: 15px;
        padding-right: 50px;
        position: relative;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        // background-color: #fafafa;

        .placeholder {
            color: #c0c4cc;
            position: relative;
            top: 2px;
        }
        .content {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        // 右侧下拉图标
        .icon-select {
            position: absolute;
            right: 0;
            top: 0;
            width: 35px;
            height: 100%;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.45);
            border-radius: 0 4px 4px 0;
            background-color: #fafafa;
            border-left: 1px solid #dcdfe6;
            cursor: pointer;
            text-align: center;
            &.open {
                transform: rotateZ(0deg);
            }
        }

        .disabled {
            cursor: not-allowed;
            color: #cecece;
            background-color: #fefefe;
        }
    }
</style>
