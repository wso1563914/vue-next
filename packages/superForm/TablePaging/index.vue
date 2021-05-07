<script>
    // import AuthButton from '../AuthButton/index'
    export default {
        name: 'TablePaging',
        // components: { AuthButton },
        props: {
            maxHeight: {
                type: String,
                default: '100%',
            },
            tableList: {
                // table 数据
                type: Array,
                default: () => [],
            },
            tableColumn: {
                // table 的 column
                type: Array,
                default: () => [],
            },
            tableButtons: {
                // table 按钮
                type: Array,
                default: () => [],
            },
            tableBtnWidth: {
                // 按钮宽度
                type: Number,
                default: 200,
            },
            tablePaging: {
                // table 分页配置
                type: [Object, Boolean],
                default: false,
            },
            tableTotal: {
                // table 总页数
                type: Number,
                default: 0,
            },
            pagingChange: {
                // 分页信息改变
                type: Function,
                default: () => {},
            },
        },
        data() {
            return {
                defaultAttars: {
                    // 按钮默认配置
                    type: 'text',
                    size: 'small',
                },
            };
        },
        methods: {
            handleClick(e, row, click) {
                // 表单按钮点击
                e && e.stopPropagation && e.stopPropagation();
                click && click(row.id, row);
            },
            handleSizeChange(size) {
                // 分页一页显示条数改变回调
                this.$emit('pagingChange', {
                    ...this.tablePaging,
                    pagesize: size,
                });
            },
            handleCurrentChange(page) {
                // 分页当前页数改变回调
                this.$emit('pagingChange', {
                    ...this.tablePaging,
                    page,
                });
            },
            indexMethod(index) {
                // 序号格式化
                const { page = 1, pagesize = 10 } = this.tablePaging;
                return (page - 1) * pagesize + index + 1;
            },

            createslotScope(list, _h) {
                return {
                    scopedSlots: {
                        default: scope => {
                            return list.map(btn => {
                                if (btn.render) {
                                    return btn.render(_h, scope);
                                }
                                if (typeof btn.isHide === 'function') {
                                    // 判断按钮是否隐藏
                                    if (btn.isHide(scope)) {
                                        return null;
                                    }
                                } else if (btn.isHide) {
                                    return null;
                                }
                                if (btn.confirm) {
                                    /* <auth-button
                      authkey={btn.authkey}
                      slot='reference'
                      class={{ 'gray': btn.isGray }}
                      otherAttrs={{ ...this.defaultAttars, ...btn.attrs }}
                      {...{ props: { ...this.defaultAttars, ...btn.attrs }}}
                      {...btn.otherAttrs}
                      isDisabled={btn.isDisabled ? btn.isDisabled(scope) : false}
                    >
                      { typeof btn.name === 'function' ? btn.name(scope) : btn.name }
                    </auth-button> */
                                    return (
                                        <el-popconfirm
                                            class='pop-confirm'
                                            title={typeof btn.confirm === 'function' ? btn.confirm(scope) : btn.confirm}
                                            {...{ on: { onConfirm: e => this.handleClick(e, scope.row, btn.click) } }}
                                        >
                                            <el-button>权限按钮</el-button>
                                        </el-popconfirm>
                                    );
                                }
                                return (
                                    // <auth-button
                                    //   authkey={btn.authkey}
                                    //   class={{ 'gray': btn.isGray }}
                                    //   otherAttrs={{ ...this.defaultAttars, ...btn.attrs }}
                                    //   {...{ on: { click: (e) => this.handleClick(e, scope.row, btn.click) }}}
                                    //   {...{ props: { ...this.defaultAttars, ...btn.attrs }}}
                                    //   {...btn.otherAttrs}
                                    //   isDisabled={btn.isDisabled ? btn.isDisabled(scope) : false}
                                    // >
                                    //   { typeof btn.name === 'function' ? btn.name(scope) : btn.name }
                                    // </auth-button>
                                    <el-button>权限按钮</el-button>
                                );
                            });
                        },
                    },
                };
            },
            createColumn(list = [], _h) {
                return list.map(e => {
                    if (e.children) {
                        return this.createColumn(e.children, _h);
                    }
                    return (
                        <el-table-column
                            key={e.key}
                            type={e.type}
                            prop={e.key}
                            label={e.label}
                            width={e.width}
                            min-width={e.minWidth}
                            {...{
                                scopedSlots: {
                                    default: scope => {
                                        return e.render ? e.render(_h, scope) : scope.row[e.key];
                                    },
                                },
                            }}
                        />
                    );
                });
            },
        },
        render(h) {
            const { tableList, tablePaging, tableTotal, handleSizeChange, handleCurrentChange } = this;
            return (
                <div class='tablePaging'>
                    <el-table
                        data={this.tableList}
                        max-height={this.$props.maxHeight}
                        header-cell-class-name='table-header'
                        stripe
                        {...{ props: this.$attrs, on: this.$listeners }}
                    >
                        <el-table-column type='index' label='No' width={70} index={this.indexMethod} />
                        {this.tableColumn.map(item => {
                            if (item.type === 'button') {
                                return (
                                    <el-table-column
                                        label={item.label || '操作'}
                                        width={this.tableBtnWidth}
                                        {...this.createslotScope(item.list, h)}
                                    ></el-table-column>
                                );
                            }
                            return (
                                <el-table-column
                                    key={item.key}
                                    type={item.type}
                                    prop={item.key}
                                    label={item.label}
                                    width={item.width}
                                    min-width={item.minWidth}
                                    {...{
                                        scopedSlots: {
                                            default: scope => {
                                                return item.render ? item.render(h, scope) : scope.row[item.key];
                                            },
                                        },
                                    }}
                                >
                                    {this.createColumn(item.children, h)}
                                </el-table-column>
                            );
                        })}
                        {this.tableButtons.length ? (
                            <el-table-column
                                label='操作'
                                width={this.tableBtnWidth}
                                {...this.createslotScope(this.tableButtons, h)}
                            ></el-table-column>
                        ) : null}
                    </el-table>

                    {tablePaging && tableList.length ? (
                        <el-pagination
                            background
                            current-page={tablePaging.page || 1}
                            page-sizes={tablePaging.pageSizes || [5, 10, 20, 30, 40]}
                            page-size={tablePaging.pagesize || 10}
                            layout='total, sizes, jumper, prev, pager, next'
                            total={tableTotal}
                            onSize-change={handleSizeChange}
                            onCurrent-change={handleCurrentChange}
                        />
                    ) : null}
                </div>
            );
        },
    };
</script>
<style lang="scss" scoped>
    @import './index.scss';
</style>
