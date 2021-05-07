import { parseTime, unfoldProps, findDict } from '@/utils/index'
import { couponListStaMap, couponTypeMap, couponCheckTypeMap, couponWechatColorMap, wxCoupunTypeMap, couponExpireTypeMap, isWxCodeMap } from '@/config/dict'
import { CustomStatus } from '@/components'

export const queryFormItem = [
  {
    type: 'input',
    key: 'keyword',
    otherAttrs: {
      placeholder: '请输入名称'
    }
  }
]
export const tableColumn = (page, size) => {
  return [
    {
      key: 'logo',
      label: 'logo',
      minWidth: 60,
      render: (h, scope) => <el-avatar size='small' src={scope.row.logo}></el-avatar>
    },
    {
      key: 'name',
      label: '名称',
      minWidth: 120
    },
    {
      key: 'wxCard',
      label: '是否微信卡券',
      minWidth: 120,
      render: (_, scope) => scope.row.wxCard === true ? '是' : '否'
    },
    {
      key: 'status',
      label: '状态',
      minWidth: 120,
      // render: (_, scope) => scope.row.status === 1 ? '有效' : '无效'
      render: (h, scope) => <CustomStatus list={couponListStaMap} value={scope.row.status} />
    },
    {
      key: 'couponType',
      label: '卡券类别',
      minWidth: 100,
      render: (_, { row }) => findDict(couponTypeMap, row.couponType).value
    },
    {
      key: 'beginTime',
      label: '有效时间',
      minWidth: 200,
      render: (_, record) => {
        const { expireType } = record.row
        if (expireType === 2) {
          return record.row.expireDays
        } else if (expireType === 3) {
          return '永久有效'
        } else {
          return parseTime(record.row.beginTime) + '~' + parseTime(record.row.endTime)
        }
      }
    },
    {
      key: 'createTime',
      label: '创建时间',
      minWidth: 140,
      render: (_, record) => parseTime(record.row.createTime)
    }
  ]
}
export const updateFormItem = (handleSet, handleWxCardOnchange, handleWxCardTypeOnchange, handleExpireTypeOnchange) => {
  return [
    {
      type: 'input',
      key: 'name',
      label: '名称',
      required: true,
      col: 12
    },
    {
      type: 'input',
      key: 'subTitle',
      label: '副标题',
      required: true,
      col: 12
    },
    {
      type: 'input',
      key: 'detailName',
      label: '详情页标题',
      required: true,
      col: 12
    },
    {
      type: 'select',
      key: 'status',
      label: '状态',
      col: 12,
      required: true,
      slotAttrs: {
        options: couponListStaMap
      }
    },
    {
      type: 'select',
      key: 'wxCard',
      label: '是否微信卡券',
      col: 12,
      required: true,
      slotAttrs: {
        options: isWxCodeMap
      },
      slotListeners: {
        change: handleWxCardOnchange
      }
    },
    {
      type: 'select',
      key: 'couponType',
      label: '卡券类别',
      col: 12,
      required: true,
      slotAttrs: {
        options: couponTypeMap
      }
    },
    {
      type: 'select',
      key: 'wxCardType',
      label: '微信卡券类型',
      required: true,
      col: 12,
      isHide: (formData) => !formData.wxCard,
      slotAttrs: {
        options: wxCoupunTypeMap
      },
      slotListeners: {
        change: handleWxCardTypeOnchange
      }
    },
    {
      type: 'select',
      key: 'expireType',
      label: '卡券过期类别',
      col: 12,
      required: true,
      slotAttrs: {
        options: couponExpireTypeMap
      },
      slotListeners: {
        change: handleExpireTypeOnchange
      }
    },
    {
      type: 'input',
      key: 'expireDays',
      label: '有效天数',
      col: 12
    },
    {
      type: 'dateTime',
      key: 'beginTime',
      label: '开始时间',
      col: 12,
      required: true
    },
    {
      type: 'dateTime',
      key: 'endTime',
      label: '结束时间',
      col: 12,
      required: true
    },
    {
      type: 'select',
      key: 'checkType',
      label: '核销类别',
      col: 12,
      required: true,
      slotAttrs: {
        options: couponCheckTypeMap
      }
    },
    {
      type: 'input',
      key: 'brandName',
      label: '商户名称',
      col: 12
    },
    {
      type: 'input',
      key: 'brandPhone',
      label: '商户电话',
      col: 12
    },
    {
      type: 'input',
      key: 'checkCode',
      label: '核销码',
      isHide: (formData) => formData.checkType !== 2,
      col: 12
    },
    {
      type: 'input',
      key: 'checkCountMonth',
      label: '每月兑换数',
      // extra: '0表示不限制'
      slotAttrs: {
        placeholder: '0表示不限制'
      }
    },
    {
      type: 'input',
      key: 'checkPhones',
      label: '核销人手机',
      // extra: '多个用逗号隔开',
      isHide: (formData) => formData.checkType !== 3,
      slotAttrs: {
        placeholder: '多个用逗号隔开'
      },
      col: 24
    },
    {
      type: 'textarea',
      key: 'defaultDetail',
      label: '优惠详情',
      required: true,
      // extra: '字数上限为1024个汉字',
      slotAttrs: {
        placeholder: '字数上限为1024个汉字'
      },
      isHide: (formData) => !formData.wxCard
    },
    {
      type: 'textarea',
      key: 'description',
      label: '卡券使用说明',
      col: 24,
      required: true,
      // extra: '字数上限为1024个汉字',
      slotAttrs: {
        placeholder: '字数上限为1024个汉字'
      },
      isHide: (formData) => !formData.wxCard
    },
    {
      type: 'textarea',
      key: 'prerogative',
      label: '会员卡特权说明',
      col: 24,
      // extra: '字数上限为1024个汉字',
      slotAttrs: {
        placeholder: '字数上限为1024个汉字'
      },
      isHide: (formData) => !formData.wxCard,
      required: true
    },
    {
      type: 'input',
      key: 'notice',
      label: '卡券使用提醒',
      col: 24,
      required: true,
      isHide: (formData) => !formData.wxCard,
      // extra: '字数上限为16个汉字'
      slotAttrs: {
        placeholder: '字数上限为16个汉字'
      }
    },
    {
      type: 'radio',
      key: 'color',
      label: '微信卡券颜色',
      col: 24,
      required: true,
      isHide: (formData) => !formData.wxCard,
      slotAttrs: {
        options: couponWechatColorMap,
        render: (h, values) => <span style={'display:inline-block;width:20px;height:20px;background-color:' + values} ></span>
      }
    },
    {
      type: 'upload',
      key: 'logo',
      label: '列表图',
      col: 12,
      required: true,
      slotAttrs: {
        data: {
          tableName: 'Coupon',
          attachType: 1
        },
        limit: 1,
        isCropper: true,
        cropperConfig: {
          autoCropWidth: '678px',
          autoCropHeight: '160px'
        },
        formatStr: '|'
      },
      extra: '图片尺寸(宽 * 高): 678 * 160'
    },
    {
      type: 'upload',
      key: 'bannerImg',
      label: '详情图',
      required: true,
      col: 12,
      slotAttrs: {
        data: {
          tableName: 'BbsActivity',
          attachType: 1
        },
        isCropper: true,
        cropperConfig: {
          autoCropWidth: '650px',
          autoCropHeight: '264px'
        }
      },
      extra: '图片尺寸(宽 * 高): 650 * 264'
    },
    {
      type: 'custom',
      key: 'btnStrs',
      label: '按钮设置',
      col: 12,
      render: (h) => <el-button type='primary' {...unfoldProps('on', { click: handleSet })} >设置</el-button>
    },
    {
      type: 'editor',
      key: 'content',
      label: '卡券说明'
    }
  ]
}

export const formButtons = (onSubmit, onReset) => {
  return {
    isDialog: true,
    submitName: '提交',
    resetName: '取消',
    submitCallback: values => onSubmit(values),
    resetCallback: () => onReset()
  }
}
