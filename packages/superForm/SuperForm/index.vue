<script>
    import FormItem from './FormItem';
    import { FormRow, FormCol } from '../FormLayout';
    import deleteImg from './assets/deleteSvgIcon';
    import addImg from './assets/addSvgIcon';

    export default {
        name: 'SuperForm',
        components: { FormItem, FormRow, FormCol, deleteImg, addImg },
        props: {
            formRef: {
                // form 的 ref
                type: String,
                default: 'formRef',
            },
            formData: {
                // form 的 数据
                type: Object,
                default: () => ({}),
            },
            otherAttrs: {
                // form 的其他属性
                type: Object,
                default: () => ({}),
            },
            renderFormItem: {
                // formItem 的参数
                type: Array,
                default: () => [],
            },
            formButtons: {
                // form 按钮
                type: Object,
                default: () => ({}),
            },
            isHideButtons: {
                // 是否隐藏按钮
                type: Boolean,
                default: false,
            },
            isDialogForm: {
                // 是否弹窗 form
                type: Boolean,
                default: false,
            },
            inputWidth: {
                // 输入框宽度
                type: [Boolean, String],
                default: false,
            },
            loading: {
                // 保存按钮 loading
                type: Boolean,
                default: false,
            },
            onChange: {
                // 下拉改变
                type: Function,
                default: () => {},
            },
            groupWrap: {
                /**
                 * 将一些formItem进行分组
                 * [{ title: '标题', list: ['key'] }]
                 * list中的'key'对应formItem中的key
                 */
                type: Array,
                default: () => [],
            },
            getRef: {
                type: Function,
                default: () => {},
            },
        },
        data() {
            return {
                normalizedFormData: {},
                editorRefObj: {}, // 富文本
            };
        },
        watch: {
            formData: {
                handler: function(val) {
                    let data = { ...this.normalizedFormData, ...val };
                    if (JSON.stringify(this.formData) === JSON.stringify({})) {
                        data = {};
                    }
                    this.$data.normalizedFormData = this.formatInitFormData(JSON.parse(JSON.stringify(data)));
                },
                deep: true,
                immediate: true,
            },
        },
        mounted() {
            this.getRef && this.getRef(this);
        },
        methods: {
            setFormData(data) {
                // 外部调用设置值
                this.normalizedFormData = {
                    ...this.normalizedFormData,
                    ...data,
                };
            },
            getFormData() {
                return this.normalizedFormData;
            },
            formatRules(formItem) {
                // 格式化 rules
                if (formItem.rules) {
                    return formItem.rules;
                }
                let trigger = 'blur';
                if (formItem.type === 'tag') {
                    trigger = 'focus';
                }
                if (formItem.required) {
                    return {
                        required: true,
                        message: formItem.label + '不能为空',
                        trigger,
                    };
                }
                return null;
            },
            formatFormData(_submitData) {
                // 格式化表单数据
                const result = {};
                const subKeyList = [];
                Object.keys(_submitData).forEach(e => {
                    const currentRender = this.$props.renderFormItem.find(ee => ee.key === e);
                    if (currentRender && currentRender.subKey && Array.isArray(currentRender.subKey)) {
                        const currentSub = _submitData[e] || [];
                        currentRender.subKey.forEach((eee, iii) => {
                            subKeyList.push(eee);
                            result[eee] = currentSub[iii];
                        });
                    } else if (currentRender && currentRender.type === 'checkbox') {
                        // checkbox 值处理
                        const { slotAttrs = {} } = currentRender;
                        result[e] = _submitData[e].join(slotAttrs.formatStr || ',');
                    } else {
                        !subKeyList.includes(e) && (result[e] = _submitData[e]);
                    }
                });
                const { editorRefObj } = this;
                Object.keys(editorRefObj).forEach(e => {
                    result[e] = this.$refs[`formItem${e}Ref`] && this.$refs[`formItem${e}Ref`].$refs[editorRefObj[e]].getContent();
                });
                return result;
            },
            formatInitFormData(_initData = {}) {
                // 初始化表单数据
                const result = {};
                this.$props.renderFormItem.forEach(e => {
                    if (e.subKey && Array.isArray(e.subKey)) {
                        result[e.key] = [];
                        e.subKey.forEach(ee => {
                            _initData[ee] && result[e.key].push(_initData[ee]);
                        });
                        result[e.key].length === 0 && (result[e.key] = null);
                    } else {
                        result[e.key] = _initData[e.key];
                    }
                    if (e.type === 'checkbox') {
                        const { slotAttrs = {} } = e;
                        result[e.key] = _initData[e.key] ? _initData[e.key].split(slotAttrs.formatStr || ',') : [];
                    }
                });
                return { ..._initData, ...result };
            },
            handleSubmit() {
                const formData = this.formatFormData(this.$data.normalizedFormData);
                // beforeSubmit钩子可以返回一个boolean
                let flag = this.formButtons.beforeSubmit && this.formButtons.beforeSubmit(formData);
                if (flag === false) {
                    return;
                }
                // 提交按钮
                this.$refs[this.formRef].validate(valid => {
                    if (valid) {
                        this.formButtons.submitCallback && this.formButtons.submitCallback(formData);
                    }
                });
                this.$emit('update:loading', false);
            },
            handleCancel() {
                // 重置按钮
                this.$refs[this.formRef].resetFields();
                const formData = this.formatFormData(this.$data.normalizedFormData);
                if (this.formButtons.cancelCallback) {
                    this.formButtons.cancelCallback(formData);
                } else {
                    this.$router.go(-1);
                }
            },

            formatFormItemProps(formItem) {
                // 格式化 formItemProps 所需的数据 可以在此添加新的属性
                const { type, label, key, otherAttrs, slotAttrs, render, extra } = formItem;
                const { inputWidth, unfoldProps, normalizedFormData, formatRules, formatUploadUrl } = this;
                if (type === 'title') {
                    return <div {...unfoldProps('props', otherAttrs)}>{label}</div>;
                }
                if (type === 'editor') {
                    this.editorRefObj[key] = `editor${key}Ref`;
                    normalizedFormData[key] &&
                        this.$nextTick(() => {
                            const ele = this.$refs[`formItem${key}Ref`].$refs[`editor${key}Ref`];
                            ele &&
                                ele.initSuccess().then(() => {
                                    ele.setContent(normalizedFormData[key]);
                                });
                        });
                }
                const formItemProps = {
                    type,
                    label,
                    prop: formItem.prop ? formItem.prop : key,
                    keyName: key,
                    formData: normalizedFormData,
                    slotAttrs,
                    rules: formatRules(formItem),
                };
                if (type === 'custom') {
                    formItemProps.render = render;
                }
                if (type === 'upload') {
                    formItemProps.slotAttrs = formItemProps.slotAttrs || {};
                    const { formatStr } = formItemProps.slotAttrs;
                    const fileList = formatUploadUrl(normalizedFormData[key], formatStr);
                    formItemProps.slotAttrs.fileList = fileList;
                }
                inputWidth && (formItemProps.inputWidth = inputWidth);
                extra && (formItemProps.extra = extra);

                return formItemProps;
            },
            formatUploadUrl(uploadUrl, str) {
                // 格式化上传文件的 url
                if (uploadUrl && typeof uploadUrl === 'string') {
                    return uploadUrl.split(str).map(item => ({ url: item }));
                }
                if (uploadUrl && uploadUrl.length) {
                    return uploadUrl.map(item => ({ url: item }));
                }
                return [];
            },
            formatRenderFormItem() {
                // 格式化 renderFormItem
                if (!this.groupWrap.length) {
                    return this.renderFormItem;
                }
                const groupTitleObj = {};
                const newFormItem = [];
                const tempArr = [];
                const groupWrap = JSON.parse(JSON.stringify(this.groupWrap));
                groupWrap.forEach(group => {
                    // 为list中每一个key分配一个title
                    group.list.forEach(item => {
                        groupTitleObj[item] = group.title;
                    });
                });
                // 将属于同一个groupTitle的formItem归类
                this.renderFormItem.forEach(item => {
                    const groupTitle = groupTitleObj[item.key];
                    const index = tempArr.indexOf(groupTitle);
                    if (index === -1 || !groupTitle) {
                        if (item.type === 'multi') {
                            newFormItem.push({
                                groupTitle,
                                multi: true,
                                parentKey: item.key,
                                titleHasAdd: Boolean(item.titleHasAdd),
                                initData: item.initData, // multi为true,则initData一定要有，initData则于formData中被动态增加的表单的数据结构一样
                                formItemList: item.subFormItems,
                            });
                        } else {
                            newFormItem.push({
                                groupTitle,
                                formItemList: [item],
                            });
                        }
                        tempArr.push(groupTitle);
                        return false;
                    }
                    newFormItem[index].formItemList.push(item);
                });
                return newFormItem;
            },
            unfoldProps(type, ...args) {
                // 展开属性
                return { [type]: Object.assign({}, ...args) };
            },
            renderCol(row, col, props, children) {
                // 渲染是否 form-col
                let coll = col;
                coll = this.execFunc(coll, this.normalizedFormData);
                const { unfoldProps } = this;
                if (row) {
                    return (
                        <form-row>
                            <form-col {...unfoldProps('props', props)}>{children}</form-col>
                        </form-row>
                    );
                }
                if (coll) {
                    return <form-col {...unfoldProps('props', props)}>{children}</form-col>;
                }
                return <form-col {...unfoldProps('props', props)}>{children}</form-col>;
            },
            renderFormItemFn(formItem) {
                // 渲染 formItem
                const { otherAttrs, slotListeners, key, type, className } = formItem;
                const { setFormData, unfoldProps, formatFormItemProps, onChange, renderLine } = this;
                const formItemProps = formatFormItemProps(formItem);
                const superFormDataFn = { setFormData };
                if (type === 'line') {
                    return renderLine(formItem);
                }
                return (
                    <FormItem
                        key={key}
                        ref={`formItem${key}Ref`}
                        class={className}
                        {...unfoldProps('props', otherAttrs, { onChange })}
                        {...unfoldProps('attrs', formItemProps)}
                        {...unfoldProps('on', superFormDataFn, slotListeners)}
                    />
                );
            },
            // 分割线
            renderLine(formItem) {
                const { slotAttrs } = formItem;
                const { unfoldProps } = this;
                return <div class='divide-line' {...unfoldProps('attrs', slotAttrs)}></div>;
            },
            renderFormButton() {
                // 渲染按钮
                const { formButtons, isHideButtons, unfoldProps, handleSubmit, handleCancel, loading } = this;
                const { isDialog = false, otherBtn, cancelName, submitName, submitDisabled, isHideSubmitBtn } = formButtons;
                let dialogClass = isDialog ? 'dialog-action-box' : 'normal-form-footer';
                if (isHideButtons) {
                    return null;
                }
                return (
                    <div span={24}>
                        <div class='empty-block' />
                        <div class={dialogClass}>
                            {otherBtn ? (
                                <el-button
                                    class='superform-foot-btn normal'
                                    type={otherBtn.type || 'default'}
                                    {...unfoldProps('on', { click: otherBtn.click })}
                                >
                                    {otherBtn.name}
                                </el-button>
                            ) : null}
                            <el-button class='superform-foot-btn normal' {...unfoldProps('on', { click: handleCancel })}>
                                {cancelName || '取消'}
                            </el-button>
                            {isHideSubmitBtn ? null : (
                                <el-button
                                    class='superform-foot-btn primary'
                                    type='primary'
                                    loading={loading}
                                    disabled={submitDisabled || false}
                                    {...unfoldProps('on', { click: handleSubmit })}
                                >
                                    {submitName || '确定'}
                                </el-button>
                            )}
                        </div>
                    </div>
                );
            },
            renderGroupWrapFormItem() {
                const groupWrapFormItem = this.formatRenderFormItem();
                const { renderCol, renderFormItemFn, handlMultiAdd, handlMultiDelete } = this;
                return groupWrapFormItem.map(item => {
                    const { groupTitle, formItemList, multi, titleHasAdd, initData } = item;
                    if (groupTitle && !multi) {
                        return (
                            <div class='group normal'>
                                <div class='title-wrap'>
                                    <div class='title'>{item.groupTitle}</div>
                                </div>
                                <div class='group-content'>
                                    {formItemList.map(item2 => {
                                        const { col, isHide, key, row } = item2;
                                        if (this.execFunc(isHide, this.normalizedFormData)) {
                                            return null;
                                        }
                                        const wrapProps = { key, span: this.execFunc(col, this.normalizedFormData) };
                                        return renderCol(row, col, wrapProps, renderFormItemFn(item2));
                                    })}
                                </div>
                            </div>
                        );
                    } else if (groupTitle && multi) {
                        let multiData = this.normalizedFormData[item.parentKey];
                        const multiInitData = JSON.stringify(initData);
                        // 动态增减表单项
                        return (
                            <div class='group multi'>
                                <div class='title-wrap'>
                                    <div class='title'>{item.groupTitle}</div>
                                    {titleHasAdd ? (
                                        <span class='icon-action title-icon' on={{ click: () => handlMultiAdd(multiData, multiInitData) }}>
                                            <addImg />
                                        </span>
                                    ) : null}
                                </div>
                                {multiData.map((parant, i) => {
                                    return (
                                        <div class='group-content' key={i}>
                                            <div class='group-left'>
                                                {formItemList.map(item2 => {
                                                    const { col, isHide, key, row } = item2;
                                                    if (this.execFunc(isHide, this.normalizedFormData)) {
                                                        return null;
                                                    }
                                                    item2.prop = `${item.parentKey}.${i}.${key}`;
                                                    const wrapProps = {
                                                        key,
                                                        span: this.execFunc(col, this.normalizedFormData),
                                                    };
                                                    return renderCol(row, col, wrapProps, renderFormItemFn(item2));
                                                })}
                                            </div>
                                            <div class='group-right'>
                                                {titleHasAdd || i > 0 ? (
                                                    <span
                                                        class='icon-action delete'
                                                        on={{ click: () => handlMultiDelete(multiData, i, titleHasAdd) }}
                                                    >
                                                        <deleteImg />
                                                    </span>
                                                ) : null}
                                                {titleHasAdd ? null : (
                                                    <span
                                                        class='icon-action add'
                                                        on={{ click: () => handlMultiAdd(multiData, multiInitData) }}
                                                    >
                                                        <addImg />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }
                    return formItemList.map(item3 => {
                        const { col, isHide, key, row } = item3;
                        if (this.execFunc(isHide, this.normalizedFormData)) {
                            return null;
                        }
                        const wrapProps = { key, span: col };
                        return renderCol(row, col, wrapProps, renderFormItemFn(item3));
                    });
                });
            },
            renderNoGroupWrapFormItem() {
                const { renderFormItem, renderCol, renderFormItemFn } = this;
                return renderFormItem.map(item => {
                    const { col, isHide, key, row } = item;
                    if (this.execFunc(isHide, this.normalizedFormData)) {
                        return null;
                    }
                    const wrapProps = { key, span: this.execFunc(col, this.normalizedFormData) };
                    return renderCol(row, col, wrapProps, renderFormItemFn(item));
                });
            },
            execFunc(item, formData) {
                if (typeof item === 'function') {
                    return item(formData);
                }
                return item;
            },
            // 动态添加表单项目的+方法
            handlMultiAdd(item, initData) {
                item.push(JSON.parse(initData));
            },
            // 动态添加表单项目的-方法
            handlMultiDelete(item, index, titleHasAdd) {
                if (!titleHasAdd && item.length === 1) {
                    return;
                }
                item.splice(index, 1);
            },
        },
        render(h) {
            const {
                $attrs,
                formRef,
                otherAttrs,
                groupWrap,
                normalizedFormData,
                isDialogForm,
                unfoldProps,
                renderFormButton,
                renderGroupWrapFormItem,
                renderNoGroupWrapFormItem,
            } = this;
            return (
                <el-form
                    ref={formRef}
                    class={'super-form ' + (isDialogForm ? 'dialog-form' : '')}
                    {...unfoldProps('props', $attrs, otherAttrs, { model: normalizedFormData })}
                    vLoading={otherAttrs.loading}
                >
                    <div class='form-item-wrap'>{!groupWrap.length ? renderNoGroupWrapFormItem(h) : renderGroupWrapFormItem(h)}</div>
                    {renderFormButton()}
                    <div class='clear' />
                    <div class='slot'>{this.$slots.footer}</div>
                </el-form>
            );
        },
    };
</script>

<style lang="scss" scoped>
    .dialog-form {
        margin: -12px; // 根据设置的父级的 el-dialog__body padding

        .form-item-wrap {
            overflow-y: auto;
            max-height: calc(98vh - 118px);
        }
    }

    .super-form {
        .form-item-wrap {
            width: 100%;
            .form-col {
                // margin-bottom: 16px;
                vertical-align: top;
            }
            .group {
                .title-wrap {
                    margin-bottom: 20px;
                    .title {
                        font-size: 16px;
                        color: #222222;
                        // font-weight: 700;
                    }
                }
                .group-content {
                    padding: 4px 0 20px;
                }
                &.normal {
                    margin-bottom: 24px;
                    // border-bottom: 1px solid #f0f3f6;
                    box-sizing: border-box;
                }
                &.multi {
                    .group-content {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .title-wrap {
                        display: flex;
                        .title-icon {
                            margin-left: 16px;
                            margin-top: 2px;
                        }
                    }
                    .group-left {
                        background: #f7f8fb;
                        border-radius: 1px;
                        padding-top: 16px;
                        flex: 1;
                    }
                    .group-right {
                        background: #fff;
                        width: 134px;
                        height: 100%;
                        padding: 0 36px;
                    }
                    .icon-action {
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                        margin-right: 11px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }

    .super-form ::v-deep {
        .el-form-item {
            line-height: 32px;
            margin-bottom: 20px;

            .el-form-item__label {
                height: 32px;
                line-height: 20px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .el-form-item__content {
                left: 16px;
                line-height: 32px;
                input {
                    height: 32px;
                }
            }
            .el-input__suffix,
            .el-input__prefix {
                .el-input__icon {
                    line-height: 32px;
                }
            }
        }

        .el-form-item--small.el-form-item {
            margin-bottom: 0;
        }

        .el-radio-group {
            display: inline-block;
            line-height: 32px;
            padding-top: 6px;
            box-sizing: border-box !important;
        }

        .el-switch {
            height: 32px;
        }

        .el-input.is-disabled .el-input__inner,
        .el-textarea.is-disabled .el-textarea__inner {
            background: #f5f7f9;
        }
    }

    .clear {
        clear: both;
    }

    .dialog-action-box {
        width: 100%;
        border-top: 1px solid #eaeaea;
        text-align: right;
        padding: 12px;
        box-sizing: border-box;
    }
    .normal-form-footer ::v-deep {
        margin-top: 15px;
        .superform-foot-btn {
            padding: 10px 36px;
            &.normal {
                border: 1px solid #e4e6ee;
            }
            &.primary {
                border: 1px solid #46a5e1;
            }
        }
    }
    .divide-line {
        width: 100%;
        height: 1px;
        margin: 4px 0 24px;
        background: #f0f3f6;
    }
</style>
