<script>
    import formItemMixin from './formItemMixin';

    export default {
        name: 'FormItem',
        mixins: [formItemMixin],
        props: {
            type: {
                // 元素类型
                type: String,
                default: 'input',
            },
            prop: {
                // el-form-item prop
                type: String,
                default: '',
            },
            keyName: {
                // el-form-item keyName
                type: String,
                default: '',
            },
            formData: {
                // form 绑定的数据
                type: Object,
                default: () => ({}),
            },
            slotAttrs: {
                // form 绑定的数据
                type: Object,
                default: () => ({}),
            },
            render: {
                type: Function,
                default: () => {},
            },
            inputWidth: {
                // 输入框宽度
                type: [Boolean, String],
                default: false,
            },
            onChange: {
                // 下拉改变
                type: Function,
                default: () => {},
            },
            labelWidth: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                inputDefaultAttrs: {
                    style: { width: '70%' },
                    placeholder: '请输入',
                },
                buttonDefaultAttrs: {
                    size: 'small',
                    type: 'text',
                },
                selectDefaultAttrs: {
                    style: { width: '70%' },
                    placeholder: '请选择',
                },
                uploadDefaultAttrs: {
                    limit: 1,
                    listType: 'picture-card',
                },
                datePickerDefaultAttrs: {
                    style: { width: '70%' },
                    placeholder: '请选择时间',
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间',
                },
            };
        },
        watch: {
            inputWidth: {
                handler: function() {
                    const { inputWidth } = this;
                    if (inputWidth) {
                        this.inputDefaultAttrs.style.width = inputWidth;
                        this.selectDefaultAttrs.style.width = inputWidth;
                        this.datePickerDefaultAttrs.style.width = inputWidth;
                    }
                },
                immediate: true,
            },
        },
        methods: {
            unfoldProps(type, ...args) {
                // 展开属性
                return { [type]: Object.assign({}, ...args) };
            },
            renderItem(h) {
                const {
                    type,
                    renderInput,
                    renderIntNumber,
                    renderTextarea,
                    renderSelect,
                    renderDatePicker,
                    renderDateTimePicker,
                    renderTimePicker,
                    renderCascader,
                    renderRadioGroup,
                    renderCheckboxGroup,
                    renderSwitch,
                    renderButton,
                    renderEditor,
                    renderTags,
                    renderAttachUplaod,
                    renderCustom,
                } = this;
                switch (type) {
                    case 'input':
                        return renderInput(h);
                    case 'int':
                        return renderIntNumber(h);
                    case 'textarea':
                        return renderTextarea();
                    case 'select':
                        return renderSelect();
                    case 'date':
                        return renderDatePicker();
                    case 'dateTime':
                        return renderDateTimePicker();
                    case 'time':
                        return renderTimePicker();
                    case 'cascader':
                        return renderCascader();
                    case 'radio':
                        return renderRadioGroup(h);
                    case 'checkbox':
                        return renderCheckboxGroup(h);
                    case 'switch':
                        return renderSwitch();
                    case 'button':
                        return renderButton();
                    case 'editor':
                        return renderEditor();
                    case 'tag':
                        return renderTags();
                    case 'upload':
                        return renderAttachUplaod(h);
                    case 'custom':
                        return renderCustom(h);
                    default:
                        return null;
                }
            },

            renderExtra(h) {
                const { extra } = this.$attrs;
                if (typeof extra === 'string') {
                    return extra;
                } else if (typeof extra === 'function') {
                    return extra(h);
                }
                return null;
            },
        },

        render(h) {
            const { $attrs, $listeners, prop, unfoldProps, renderItem, renderExtra, labelWidth } = this;
            return (
                <el-form-item prop={prop} {...unfoldProps('attrs', $attrs, { labelWidth })} {...unfoldProps('on', $listeners)}>
                    {renderItem(h)}
                    {$attrs.extra ? <div class='extra'>{renderExtra(h)}</div> : null}
                </el-form-item>
            );
        },
    };
</script>

<style lang="scss" scoped>
    .cascader-item {
        position: absolute;
        top: 0;
        left: 40px;
        width: 136px;
        z-index: 9999;
    }

    .extra {
        color: #e74845;
        margin-left: 12px;
        line-height: 32px;
    }

    // 标签
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-right: 10px;
        vertical-align: bottom;
    }

    .tag-wrap ::v-deep {
        .el-tag {
            margin-right: 10px;
        }
    }
</style>
