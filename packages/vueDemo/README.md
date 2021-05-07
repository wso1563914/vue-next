# superform
```
<superForm
  :form-data="formData" // form数据
  :renderFormItem="renderFormItem" // formItem数据
  :otherAttrs="{labelWidth: '92px'}" // form组件的其他属性
  :formButtons="formButtons" // 按钮的回调方法
  :groupWrap="groupWrap"
  :onChange="onChange" // 所有formItem的值变化都会执行这个方法，返回3个参数：value: 当前值，prop：formItem的key，formData： 表单的数据
>
</superForm>
```
## 生成formItem需要的属性
```
{
    type: 'upload', // formItem的类型
    key: 'bannerImg', // formItem的值
    label: 'banner图', // formItem的label
    required: true, // 是否要校验
    row: true, // 单独一行
    col: 12, // 不和row捆绑， 最大值为24
    className: '',
    slotAttrs: {
      // 任意输入，作为dom的attrs, el组件的Attributes
      options: [ // options选项是提供给checkbox和radio的
        // radio
        {
            label: '英雄联盟',
            key: 'lol'
        }，
        // checkbox
        {
            label: '英雄联盟',
            key: 'lol'
        }
      ],
      placeholder: '请输入标题',
      style: '', // 样式写字符串,比如font-size: 12px

    },
    otherAttrs: {}, // ElformItem其他的属性
    slotListeners: {
        // 相当于v-on， 和elementUI的formItem提供的一致，返回3个参数：value: 当前值，prop：formItem的key，formData： 表单的数据
        change: this.gameChange
    }

    extra: '图片尺寸(宽 * 高): 690 * 350' // 额外内容，跟在formItem下面

    render: type为custom时用
}
```

## formButtons的属性
```
formButtons: {
  beforeSubmit: 提交表单校验前的回调
  submitCallback： 表单校验成功后的回调
  cancelCallback： 取消按钮的回调
  isDialog,
  otherBtn: {
    type: 'primary',
    click,
    name,
  },
  cancelName,
  submitName,
  submitDisabled,
  isHideSubmitBtn
}
```
## groupWrap的属性
```
// 将一些formItem进行分组
formButtons: [
  {
    title: '标题',
    list: ['key']  // list中的'key'对应formItem中的key
  }
]

```
