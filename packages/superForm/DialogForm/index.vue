<template>
    <el-dialog v-if="visible" :visible="visible" v-bind="$attrs" :close-on-click-modal="false" v-on="$listeners">
        <!-- <super-form :ref="formRef" form-ref="modalForm" v-bind="formAttrs" /> -->
    </el-dialog>
</template>

<script>
    // import { SuperForm } from '@/Components/superForm/SuperForm';

    export default {
        name: 'DialogForm',
        // components: { SuperForm },
        props: {
            visible: {
                // 弹窗显隐
                type: Boolean,
                default: false,
            },
            formAttrs: {
                // form 配置
                type: Object,
                default: () => ({}),
            },
            formRef: {
                type: String,
                default: 'superFormRef',
            },
        },
        data() {
            return {};
        },
    };
</script>
