<script>
export default {
    render(h) {
        return (
            <div>
                <el-input vModel={this.pageSize}/>
                <el-select vModel={this.selectVal}  ref="input"  on={{...this.linsenterArr}} attrs={{...this.attrs}}>
                    <el-option value={1} label="张三"></el-option>
                    <el-option value={2} label="李四"></el-option>
                </el-select>
            </div>
        )
    },
    name: 'Custom',
    data() {
        return {
            pageSize: 2,
            selectVal: '',
            linsenterArr: {
                change: this.change
            },
            attrs: {
                class: 'custom-select',
                // style: `
                    // width: 500px;
                    // height: 80px
                    // `
            }
        }
    },
    mounted() {
        console.log(this.$refs.input);
    },
    methods: {
        change(val) {
            console.log(val);
        }
    },

}
</script>

<style lang="scss">

</style>
