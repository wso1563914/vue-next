<template>
    <div :is="cardWrap ? 'el-card' : 'div'" class="table-search" shadow="never">
        <el-form ref="formRef" size="small" :inline="true" :model="formValue" class="demo-form-inline" v-bind="{ ...$attrs }">
            <div class="form-container">
                <div class="form-row">
                    <div class="form-row-left">
                        <template v-for="searchFormItem in searchForm">
                            <el-form-item
                                v-if="isHide(searchFormItem.isHide)"
                                :key="searchFormItem.label"
                                :style="'margin-right:' + (searchFormItem.labelWidth ? 0 : '24px')"
                                :label="searchFormItem.label"
                                :prop="searchFormItem.key"
                                :label-width="searchFormItem.labelWidth"
                            >
                                <el-input
                                    v-if="searchFormItem.type === 'input'"
                                    v-model="formValue[searchFormItem.key]"
                                    v-bind="{ ...inputAttrs, ...searchFormItem.otherAttrs }"
                                />
                                <el-select
                                    v-else-if="searchFormItem.type === 'select'"
                                    v-model="formValue[searchFormItem.key]"
                                    filterable
                                    v-bind="{ ...selectAttrs, ...searchFormItem.otherAttrs }"
                                    v-on="{ ...searchFormItem.slotListeners }"
                                >
                                    <el-option
                                        v-for="option in searchFormItem.options"
                                        :key="option.key"
                                        :label="option.value"
                                        :value="option.key"
                                    />
                                </el-select>
                                <el-date-picker
                                    v-else-if="searchFormItem.type === 'date'"
                                    v-model="formValue[searchFormItem.key]"
                                    :type="(searchFormItem.otherAttrs || {}).type || 'date'"
                                    style="width: 100%;"
                                    :value-format="searchFormItem.valueFormat || 'yyyy-MM-dd'"
                                    v-bind="{ ...selectAttrs, ...searchFormItem.otherAttrs }"
                                />
                                <el-date-picker
                                    v-else-if="searchFormItem.type === 'daterange'"
                                    v-model="formValue[searchFormItem.key]"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    :value-format="searchFormItem.valueFormat || 'yyyy-MM-dd'"
                                    v-bind="{ ...selectAttrs, ...searchFormItem.otherAttrs }"
                                />
                                <el-cascader
                                    v-else-if="searchFormItem.type === 'cascader'"
                                    v-model="formValue[searchFormItem.key]"
                                    :props="searchFormItem.props"
                                    v-bind="{ ...selectAttrs, ...searchFormItem.otherAttrs }"
                                    v-on="$listeners"
                                />
                            </el-form-item>
                        </template>
                    </div>
                    <div class="form-row-right">
                        <el-form-item>
                            <el-button type="primary" @click="handleSubmit">
                                查询
                            </el-button>

                            <el-button v-if="!hideReset" @click="handleReset">
                                重置
                            </el-button>
                        </el-form-item>
                    </div>
                </div>
            </div>
        </el-form>
        <slot name="new-add-button" />
    </div>
</template>

<script>
    export default {
        props: {
            cardWrap: {
                // 是否用el-card组件包裹
                type: Boolean,
                default: true,
            },
            hideReset: {
                // 重置按钮是否显示
                type: Boolean,
                default: false,
            },
            searchForm: {
                type: Array,
                default: () => [],
            },
            onSubmit: {
                type: Function,
                default: () => {},
            },
            onReset: {
                type: Function,
                default: () => {},
            },
            // formValue: {
            //   type: Object,
            //   default: () => {}
            // }
        },
        data() {
            return {
                formValue: {},
                inputAttrs: {
                    style: {
                        width: '160px',
                    },
                    placeholder: '请输入',
                },
                selectAttrs: {
                    style: {
                        width: '160px',
                    },
                    placeholder: '请选择',
                },
            };
        },
        computed: {
            isHide() {
                return function(val) {
                    if (!val) {
                        return true;
                    }
                    if (typeof val !== 'function') {
                        return !val;
                    }
                    return !val(this.formValue);
                };
            },
        },
        methods: {
            setFormValue(data) {
                // 外部调用设置 formValue值
                this.formValue = {
                    ...this.formValue,
                    ...data,
                };
            },

            getFormRef() {
                return this.$refs.formRef;
            },
            getFormData() {
                const data = this.formatFormData(this.$data.formValue);
                return data;
            },
            initFormValue() {
                const formData = {};
                this.searchForm.forEach(item => {
                    formData[item.key] = null;
                });
                this.formValue = formData;
            },
            formatFormData(_submitData) {
                const result = {};
                const subKeyList = [];
                Object.keys(_submitData).forEach(e => {
                    const currentRender = this.$props.searchForm.find(ee => ee.key === e);
                    if (currentRender && currentRender.subKey) {
                        const currentSub = _submitData[e] || [];
                        currentRender.subKey.forEach((eee, iii) => {
                            subKeyList.push(eee);
                            result[eee] = currentSub[iii];
                        });
                    } else {
                        !subKeyList.includes(e) && (result[e] = _submitData[e]);
                    }
                });
                return result;
            },
            handleSubmit() {
                this.$refs.formRef.validate(success => {
                    const data = this.formatFormData(this.$data.formValue);
                    if (data.daterange) {
                        const [beginDate, endDate] = data.daterange;
                        data.beginDate = beginDate;
                        data.endDate = endDate;
                    }
                    success && this.onSubmit && this.onSubmit(data);
                });
            },
            handleReset() {
                // 重置搜索条件
                this.$refs.formRef.resetFields();
                this.initFormValue();
                this.onReset && this.onReset(this.formValue);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .form-container {
        display: flex;
    }
    .table-search {
        margin-bottom: 20px;

        ::v-deep .el-card__body {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .el-card__body {
            padding: 16px 24px;
        }

        .form-row {
            flex: 1;
            display: flex;
            // justify-content: space-between;

            .form-row-left {
                flex-wrap: wrap;
            }

            .form-row-right {
                width: 140px;
                text-align: right;
                white-space: nowrap;
            }
        }

        .el-form.el-form--inline .el-form-item {
            margin-top: 6px;
            margin-bottom: 6px;
        }
    }
</style>
