<script>
    export default {
        name: 'FormRow',
        render() {
            return <div class='form-row'>{this.$slots.default}</div>;
        },
    };
</script>

<style lang="scss" scoped>
    .form-row {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }
</style>
