// import Editor from '@/components/Tinymce';
// import AttachUpload from './components/AttachUpload/index';

export default {
    data() {
        return {
            tagList: [], // 标签所有的值
            tagInputValue: '', // 标签输入框值
            tagInputVisible: false, // 标签输入框

            checkboxValue: [], // checkbox 值
        };
    },
    methods: {
        // 所有组件的渲染方法
        execFunc(item, formData) {
            if (typeof item === 'function') {
                return item(formData);
            }
            return item;
        },
        formatVModelValue(prop, keyName) {
            const { formData } = this;
            let valueName = '';
            if (prop === keyName) {
                valueName = formData;
            } else {
                let temp = prop.split('.');
                valueName = formData[temp[0]][temp[1]];
            }
            return valueName;
        },
        renderInput(h) {
            // 输入框
            const {
                $attrs,
                $listeners,
                prop,
                keyName,
                formData,
                slotAttrs,
                inputDefaultAttrs,
                unfoldProps,
                evalOptions,
                handleChange,
                execFunc,
            } = this;
            const { append, prepend } = slotAttrs;
            slotAttrs.placeholder = slotAttrs.placeholder || '请输入';
            let listenersObj = {};
            Object.keys($listeners).forEach(fnName => {
                if (fnName !== 'setFormData') {
                    listenersObj[fnName] = e => $listeners[fnName]({ e, prop, formData });
                }
            });
            const inputFnObj = { input: e => handleChange(e, prop, formData) };
            const listeners = Object.assign({}, inputFnObj, listenersObj);
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-input
                    ref={`input${prop}`}
                    vModel={valueName[keyName]}
                    {...inputDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', listeners)}
                >
                    {append ? <template slot='append'>{evalOptions(append, h)}</template> : null}
                    {prepend ? <template slot='prepend'>{evalOptions(prepend, h)}</template> : null}
                </el-input>
            );
        },
        renderIntNumber(h) {
            // 整数
            const {
                $attrs,
                $listeners,
                prop,
                keyName,
                formData,
                slotAttrs,
                inputDefaultAttrs,
                unfoldProps,
                evalOptions,
                handleChange,
                execFunc,
            } = this;
            const { append, prepend } = slotAttrs;
            slotAttrs.placeholder = slotAttrs.placeholder || '请输入';
            const inputFnObj = {
                input: e => {
                    let a = e;
                    a = (a || '').replace(/[^0-9]/gi, '');
                    formData[prop] = a;
                    return handleChange(a, prop, formData);
                },
            };
            const listeners = Object.assign({}, inputFnObj, $listeners);
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-input
                    ref={`input${prop}`}
                    value={valueName[keyName]}
                    {...inputDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', listeners)}
                >
                    {append ? <template slot='append'>{evalOptions(append, h)}</template> : null}
                    {prepend ? <template slot='prepend'>{evalOptions(prepend, h)}</template> : null}
                </el-input>
            );
        },
        renderTextarea() {
            // 文本框
            const { $attrs, $listeners, prop, keyName, formData, slotAttrs, inputDefaultAttrs, unfoldProps, handleChange, execFunc } = this;
            let listenersObj = {};
            Object.keys($listeners).forEach(fnName => {
                if (fnName !== 'setFormData') {
                    listenersObj[fnName] = e => $listeners[fnName]({ e, prop, formData });
                }
            });
            const inputFnObj = { input: e => handleChange(e, prop, formData) };
            const listeners = Object.assign({}, inputFnObj, listenersObj);
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-input
                    type='textarea'
                    vModel={valueName[keyName]}
                    {...inputDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, inputDefaultAttrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', listeners)}
                />
            );
        },
        renderSelect() {
            // 下拉
            const {
                $attrs,
                $listeners,
                prop,
                keyName,
                formData,
                slotAttrs,
                selectDefaultAttrs,
                unfoldProps,
                evalOptions,
                handleChange,
                execFunc,
            } = this;
            const changeFnObj = { change: e => handleChange(e, prop, formData) };
            const listeners = Object.assign({}, changeFnObj, $listeners);
            // slotAttrs.render = slotAttrs.render || function() {}
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-select
                    vModel={valueName[keyName]}
                    {...selectDefaultAttrs}
                    style={slotAttrs.style}
                    class='input-border'
                    {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', listeners)}
                >
                    {evalOptions(slotAttrs.options).map((item, key) => (
                        <el-option key={key} label={item['label']} value={item['value']} />
                    ))}
                </el-select>
            );
        },
        renderDatePicker() {
            // 日期选择器
            const { $attrs, $listeners, prop, keyName, formData, slotAttrs, datePickerDefaultAttrs, unfoldProps, execFunc } = this;
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-date-picker
                    type={slotAttrs.type || 'date'}
                    vModel={valueName[keyName]}
                    {...datePickerDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, datePickerDefaultAttrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', $listeners)}
                />
            );
        },
        renderDateTimePicker() {
            // 日期时间选择器
            const { $attrs, $listeners, prop, keyName, formData, slotAttrs, datePickerDefaultAttrs, unfoldProps, execFunc } = this;
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-date-picker
                    type={slotAttrs.type || 'datetime'}
                    vModel={valueName[keyName]}
                    {...datePickerDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, datePickerDefaultAttrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', $listeners)}
                />
            );
        },
        renderTimePicker() {
            // 时间选择器
            const { $attrs, $listeners, prop, keyName, formData, slotAttrs, datePickerDefaultAttrs, unfoldProps, execFunc } = this;
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-time-picker
                    vModel={valueName[keyName]}
                    {...datePickerDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, datePickerDefaultAttrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', $listeners)}
                />
            );
        },
        renderCascader() {
            // 级联
            const { $attrs, $listeners, prop, keyName, formData, slotAttrs, selectDefaultAttrs, unfoldProps, evalOptions, execFunc } = this;
            slotAttrs.options = evalOptions(slotAttrs.options);
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-cascader
                    vModel={valueName[keyName]}
                    {...selectDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', $listeners)}
                />
            );
        },

        // renderAttachUplaod() {
        //     // 附件上传
        //     const { $attrs, prop, slotAttrs, unfoldProps, formData, handleAttachUploadChange } = this;
        //     return (
        //         <AttachUpload
        //             ref={`attachUpload${prop}Ref`}
        //             initValue={formData[prop]}
        //             {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
        //             onChange={handleAttachUploadChange}
        //         />
        //     );
        // },

        renderRadioGroup(h) {
            // 单选组
            const {
                $attrs,
                $listeners,
                prop,
                keyName,
                formData,
                slotAttrs,
                inputDefaultAttrs,
                unfoldProps,
                evalOptions,
                handleChange,
                execFunc,
            } = this;
            const formatChildren = item => {
                const value = item[slotAttrs.optionKey ? slotAttrs.optionKey.label : 'label'];
                if (slotAttrs.render) {
                    return slotAttrs.render(h, value);
                }
                return value;
            };
            const changeFnObj = { change: e => handleChange(e, prop, formData) };
            const listeners = Object.assign({}, changeFnObj, $listeners);
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-radio-group
                    vModel={valueName[keyName]}
                    {...inputDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', listeners)}
                >
                    {evalOptions(slotAttrs.options).map((item, key) => (
                        <el-radio key={key} label={item[slotAttrs.optionKey ? slotAttrs.optionKey.key : 'key']}>
                            {formatChildren(item)}
                        </el-radio>
                    ))}
                </el-radio-group>
            );
        },
        renderCheckboxGroup(h) {
            // 多选组
            const { $attrs, $listeners, prop, keyName, formData, slotAttrs, inputDefaultAttrs, unfoldProps, evalOptions, execFunc } = this;
            const formatChildren = item => {
                const value = item[slotAttrs.optionKey ? slotAttrs.optionKey.label : 'label'];
                if (slotAttrs.render) {
                    return slotAttrs.render(h, value);
                }
                return value;
            };
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);

            const valueName = this.formatVModelValue(prop, keyName);
            return (
                <el-checkbox-group
                    vModel={valueName[keyName]}
                    {...inputDefaultAttrs}
                    style={slotAttrs.style}
                    {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', $listeners)}
                >
                    {evalOptions(slotAttrs.options).map((item, key) => (
                        <el-checkbox key={key} label={item[slotAttrs.optionKey ? slotAttrs.optionKey.key : 'key']} name={prop}>
                            {formatChildren(item)}
                        </el-checkbox>
                    ))}
                </el-checkbox-group>
            );
        },

        renderSwitch() {
            const { keyName, formData, slotAttrs = {}, unfoldProps, $attrs, execFunc } = this;
            const { activeText, inactiveText } = slotAttrs;
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            const valueName = this.formatVModelValue(prop, keyName);

            return (
                <el-switch
                    vModel={valueName[keyName]}
                    activeText={activeText || '是'}
                    inactiveText={inactiveText || '否'}
                    active-value={1}
                    inactive-value={2}
                    {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                ></el-switch>
            );
        },

        renderButton() {
            // 按钮
            const { $attrs, $listeners, keyName, formData, slotAttrs, buttonDefaultAttrs, unfoldProps, execFunc } = this;
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            return (
                <el-button
                    vModel={formData[keyName]}
                    {...unfoldProps('attrs', $attrs, buttonDefaultAttrs, slotAttrs, { disabled, readonly })}
                    {...unfoldProps('on', $listeners)}
                >
                    {slotAttrs.name}
                </el-button>
            );
        },
        // renderEditor() {
        //     // 富文本
        //     const { $attrs, prop, slotAttrs, unfoldProps, } = this;
        //     return <Editor ref={`editor${prop}Ref`} {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })} />;
        // },
        renderTags() {
            // 标签
            const {
                $attrs,
                keyName,
                formData,
                slotAttrs,
                unfoldProps,
                tagInputValue,
                tagInputVisible,
                handleInputChange,
                handleInputConfirm,
                handleShowInput,
                handleTagClose,
                handleTagClick,
                handleTagBlur,
                execFunc,
            } = this;
            const formatStr = this.slotAttrs ? this.slotAttrs.formatStr || '|' : '|';
            const tagStr = formData[keyName];
            const tagList = tagStr ? tagStr.split(formatStr) : [];
            this.tagList = tagList;
            let disabled = execFunc(slotAttrs.disabled, formData);
            let readonly = execFunc(slotAttrs.readonly, formData);
            return (
                <div class='tag-wrap'>
                    {tagList.length
                        ? tagList.map((tag, key) => (
                              <el-tag
                                  key={key}
                                  closable
                                  {...unfoldProps('attrs', $attrs, slotAttrs, { disabled, readonly })}
                                  onClose={() => handleTagClose(tag)}
                                  onClick={() => handleTagClick(tag)}
                              >
                                  {tag}
                              </el-tag>
                          ))
                        : null}
                    {tagInputVisible ? (
                        <el-input
                            class='input-new-tag'
                            value={tagInputValue}
                            ref='saveTagInput'
                            size='small'
                            onInput={handleInputChange}
                            nativeOn-keyup={arg => arg.keyCode === 13 && handleInputConfirm()}
                            onBlur={handleTagBlur}
                        />
                    ) : (
                        <el-button class='button-new-tag' size='small' onClick={handleShowInput}>
                            + 添加
                        </el-button>
                    )}
                </div>
            );
        },

        renderCustom(h) {
            // 渲染自定义组件
            const { render, formData } = this;
            return render(h, formData);
        },

        // 标签相关方法开始
        handleInputChange(e) {
            this.tagInputValue = e;
        },

        handleShowInput() {
            this.tagInputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleTagClose(tag) {
            this.tagList.splice(this.tagList.indexOf(tag), 1);
            this.setTagData();
        },

        handleTagClick(tag) {
            this.slotAttrs.onClick && this.slotAttrs.onClick(tag);
        },

        handleInputConfirm() {
            const tagInputValue = this.tagInputValue;
            if (tagInputValue) {
                this.tagList.push(tagInputValue);
                this.setTagData();
            }
            this.tagInputVisible = false;
            this.tagInputValue = '';
        },

        handleTagBlur() {
            const tagInputValue = this.tagInputValue;
            if (tagInputValue) {
                this.tagList.push(tagInputValue);
                this.setTagData();
            }
            this.tagInputVisible = false;
            this.tagInputValue = '';
        },

        setTagData() {
            const { prop } = this;
            const formatStr = this.slotAttrs ? this.slotAttrs.formatStr || '|' : '|';
            this.$emit('setFormData', { [prop]: this.tagList.join(formatStr) });
        },
        // 标签相关方法结束

        evalOptions(option, h) {
            // 执行 options
            if (typeof option === 'function') {
                return option(h);
            }
            return option;
        },

        handleChange(e, key, formData) {
            // input select 内容改变
            this.onChange(e, key, formData);
        },

        // // 附件上传方法开始
        // handleAttachUploadChange(value) {
        //     // 附件上传
        //     const {
        //         prop,
        //         slotAttrs: { returnType, returnKey },
        //         formatUploadData,
        //     } = this;
        //     if (returnType === 'object') {
        //         this.$emit('setFormData', { [prop]: value });
        //         return false;
        //     }
        //     if (returnType === 'id') {
        //         this.$emit('setFormData', { [returnKey || 'new' + prop]: formatUploadData(value, 'attach_id') });
        //         return false;
        //     }
        //     this.$emit('setFormData', { [prop]: formatUploadData(value, 'attach_url') });
        // },

        formatUploadData(list, key) {
            // 格式化上传 url
            const formatStr = this.slotAttrs ? this.slotAttrs.formatStr || '|' : '|';
            let urlStr = '';
            list.forEach((item, index) => {
                if (!item[key]) {
                    return false;
                }
                if (list.length === index + 1) {
                    urlStr += item[key];
                    return false;
                }
                urlStr += item[key] + formatStr;
            });
            return urlStr;
        },
        // 附件上传方法结束
    },
};
