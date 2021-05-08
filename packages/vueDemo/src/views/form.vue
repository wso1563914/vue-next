<template>
    <div>
        <!-- :groupWrap="groupWrap" -->
        <SuperForm
        :form-data="formData"
        :renderFormItem="renderFormItem"
        :otherAttrs="{labelWidth: '92px'}"
        :formButtons="formButtons"
         >

        </SuperForm>
    </div>
</template>

<script>
import {SuperForm} from 'superform';
let gameArr = [
    {
        label: '吃鸡',
        key: 'PUBG'
    },
    {
        label: '英雄联盟',
        key: 'lol'
    }
];
let gameArr2 = [
    {
        label: '吃鸡',
        key: 'PUBG'
    },
    {
        label: '英雄联盟',
        key: 'lol'
    }
];
let gameArr3 = [
    {
        label: '吃鸡',
        value: 'PUBG'
    },
    {
        label: '英雄联盟',
        value: 'lol'
    }
];
export default {
    components: {
        SuperForm
    },
    data() {
        return {
            // groupWrap: [
            //     {
            //         title: 'nihao',
            //         list: [
            //             {
            //                 key: 'wrap1'
            //             }
            //         ]
            //     },
            //     {
            //         title: 'hello',
            //         list: [
            //             {
            //                 key: 'wrap2'
            //             }
            //         ]
            //     }
            // ],
            formData: {
                text: '552',
                gameSel: 'lol',
                title: 'okbeng'
            },
            formButtons: {
                submitCallback: value => this.handleSubmit(value)
            },

            renderFormItem: [
                // {
                //     type: 'input',
                //     key: 'text',
                //     label: '标题',
                //     required: true,
                //     slotAttrs: {placeholder: '请输入标题', clearable: true, readonly: true},
                //     otherAttrs: {inlineMessage: true},
                //     row: 2,
                //     col: 12,
                // },
                {
                    type: 'select',
                    key: 'gameSel',
                    label: '游戏选择游戏选择',
                    slotAttrs: {placeholder: '请选择', options: gameArr3},
                    slotListeners: {change: this.gameChange},
                    col: 12
                },

                {
                    type: 'input',
                    key: 'title',
                    label: '标题',
                    required: true,
                    col: 12
                },
                {
                    type: 'input',
                    key: 'subTitle',
                    label: '副标题',
                    col: 12
                },
                {
                    type: 'input',
                    key: 'orderNo',
                    label: '排序号',
                    isHide: () => this.formData.gameSel === 'lol',
                    col: 12,
                    // extra: '数字越大越靠前',
                    slotAttrs: { type: 'number', placeholder: '数字越大越靠前' }
                },
                {
                    type: 'select',
                    key: 'linkType',
                    label: '跳转类型',
                    required: true,
                    col: 12,

                    slotAttrs: {
                        options: gameArr3
                    },
                    // slotListeners: {
                    // change: handleLinkUrlOnchange
                    // }
                },
                {
                    type: 'input',
                    key: 'linkUrl',
                    label: '跳转地址',
                    otherAttrs: {inlineMessage: true},
                    col: 12,
                    required: true
                },
                // {
                //     type: 'select',
                //     key: 'type',
                //     label: '文章类型',
                //     required: true,
                //     col: 12,
                //     slotAttrs: {
                //     options: gameArr3
                //     }
                // },
                // {
                //     type: 'select',
                //     key: 'status',
                //     label: '状态',
                //     required: true,
                //     col: 12,
                //     slotAttrs: {
                //     options: gameArr3
                //     },
                //     extra: 'ddd'
                // },
                {
                    type: 'radio',
                    key: 'showPage',
                    label: '首页显示',
                    slotAttrs: {
                    options: gameArr
                    }
                },
                {
                    type: 'checkbox',
                    key: 'showPage2',
                    label: '首页显示2',
                    slotAttrs: {
                        options: gameArr2
                    }
                },
                // {
                //     type: 'upload',
                //     key: 'bannerImg',
                //     label: 'banner图',
                //     required: true,
                //     col: 12,
                //     slotAttrs: {
                //     data: {
                //         tableName: 'BbsActivity',
                //         attachType: 1
                //     },
                    // isCropper: true,
                    // cropperConfig: {
                    //     autoCropWidth: '690px',
                    //     autoCropHeight: '350px'
                    // }
                    // },
                    // extra: '图片尺寸(宽 * 高): 690 * 350'
                // },
                // {
                //     type: 'upload',
                //     key: 'logo',
                //     label: '首页图',
                //     required: true,
                //     col: 12,
                //     slotAttrs: {
                //     data: {
                //         tableName: 'BbsActivity',
                //         attachType: 1
                //     },
                //     isCropper: true,
                //     cropperConfig: {
                //         autoCropWidth: '570px',
                //         autoCropHeight: '375px'
                //     }
                //     },
                //     extra: '图片尺寸(宽 * 高): 570 * 375'
                // },
                // {
                //     type: 'editor',
                //     key: 'content',
                //     label: '文章内容',
                //     col: 24
                // }

            ]
        }
    },
    created() {

    },
    methods: {
        gameChange(val) {
            console.log(val);
            this.formData.gameSel = val;
        },
        handleSubmit(data) {
            console.log(data);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
