// import { parseTime } from '@/utils/index'
import { articalStatusMap, articalTypesMap, linkTypeMap, activeShowMap } from '@/config/dict';
import { CustomStatus } from '@/components';

export const queryFormItem = [
    {
        type: 'select',
        key: 'status',
        options: articalStatusMap,
        otherAttrs: {
            placeholder: '状态',
        },
    },
    {
        type: 'select',
        key: 'type',
        options: articalTypesMap,
        otherAttrs: {
            placeholder: '文章类型',
        },
    },
    {
        type: 'input',
        key: 'keyword',
        otherAttrs: {
            placeholder: '请输入标题',
        },
    },
];

export const tableColumn = (page, size) => {
    return [
        {
            key: 'title',
            label: '标题',
            minWidth: 120,
        },
        {
            key: 'subTitle',
            label: '副标题',
            minWidth: 120,
        },
        {
            key: 'type',
            label: '文章类型',
            minWidth: 100,
            render: (h, scope) => <CustomStatus list={articalTypesMap} value={scope.row.type} />,
        },
        {
            key: 'status',
            label: '状态',
            minWidth: 100,
            render: (h, scope) => <CustomStatus list={articalStatusMap} value={scope.row.status} />,
        },
        {
            key: 'orderNo',
            label: '排序号',
            minWidth: 120,
        },
    ];
};

export const updateFormItem = handleLinkUrlOnchange => [
    {
        type: 'input',
        key: 'title',
        label: '标题',
        required: true,
        col: 12,
    },
    {
        type: 'input',
        key: 'subTitle',
        label: '副标题',
        col: 12,
    },
    {
        type: 'input',
        key: 'orderNo',
        label: '排序号',
        col: 12,
        // extra: '数字越大越靠前',
        slotAttrs: { type: 'number', placeholder: '数字越大越靠前' },
    },
    {
        type: 'select',
        key: 'linkType',
        label: '跳转类型',
        required: true,
        col: 12,
        slotAttrs: {
            options: linkTypeMap,
        },
        slotListeners: {
            change: handleLinkUrlOnchange,
        },
    },
    {
        type: 'input',
        key: 'linkUrl',
        label: '跳转地址',
        required: true,
    },
    {
        type: 'select',
        key: 'type',
        label: '文章类型',
        required: true,
        col: 12,
        slotAttrs: {
            options: articalTypesMap,
        },
    },
    {
        type: 'select',
        key: 'status',
        label: '状态',
        required: true,
        col: 12,
        slotAttrs: {
            options: articalStatusMap,
        },
    },
    {
        type: 'radio',
        key: 'showPage',
        label: '首页显示',
        required: true,
        slotAttrs: {
            options: activeShowMap,
        },
    },
    {
        type: 'upload',
        key: 'bannerImg',
        label: 'banner图',
        required: true,
        col: 12,
        slotAttrs: {
            data: {
                tableName: 'BbsActivity',
                attachType: 1,
            },
            isCropper: true,
            cropperConfig: {
                autoCropWidth: '690px',
                autoCropHeight: '350px',
            },
        },
        extra: '图片尺寸(宽 * 高): 690 * 350',
    },
    {
        type: 'upload',
        key: 'logo',
        label: '首页图',
        required: true,
        col: 12,
        slotAttrs: {
            data: {
                tableName: 'BbsActivity',
                attachType: 1,
            },
            isCropper: true,
            cropperConfig: {
                autoCropWidth: '570px',
                autoCropHeight: '375px',
            },
        },
        extra: '图片尺寸(宽 * 高): 570 * 375',
    },
    {
        type: 'editor',
        key: 'content',
        label: '文章内容',
        col: 24,
    },
];
