<script>
    const grid = 24;

    export default {
        name: 'FormLayout',
        props: {
            span: {
                // 栅格宽度
                type: Number,
                default: 24,
            },
            offset: {
                // 偏移量
                type: Number,
                default: 0,
            },
            otherAttrs: {
                // 其他属性
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {};
        },
        computed: {
            colStyle() {
                // 格式化宽度
                const { span, offset, otherAttrs } = this;
                return {
                    width: ((span || grid) / grid) * 100 + '%',
                    marginLeft: ((offset || 0) / grid) * 100 + '%',
                    ...(otherAttrs.style || {}),
                };
            },
        },
        render() {
            const { colStyle } = this;

            return (
                <div class='form-col' style={colStyle}>
                    {this.$slots.default}
                </div>
            );
        },
    };
</script>

<style lang="scss" scoped>
    .form-col {
        display: inline-block;
        // padding-right: 20px;
        vertical-align: bottom;
        box-sizing: border-box;
    }
</style>
