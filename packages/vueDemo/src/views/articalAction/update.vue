<template>
  <el-dialog v-bind="$attrs" width="800px" custom-class="mediate-dialog">
    <super-form
      label-width="110px"
      form-ref="modalForm"
      :form-data="formData"
      :render-form-item="renderFormItem"
      :form-buttons="formButtons"
    />
  </el-dialog>
</template>

<script>
import SuperForm from '@/components/SuperForm'
import { updateFormItem } from './config'

export default {
  name: 'RightUpdate',
  components: { SuperForm },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    handleSubmit: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      renderFormItem: updateFormItem(this.handleLinkUrlOnchange),
      formButtons: {
        isDialog: true,
        submitName: '提交',
        resetName: '取消',
        submitCallback: values => this.handleSubmit(values),
        resetCallback: () => this.$emit('update:visible', false)
      }
    }
  },
  methods: {
    handleLinkUrlOnchange(e) {
      const index = this.renderFormItem.findIndex(item => item.key === 'linkUrl')
      const current = this.renderFormItem[index]

      this.$set(this.renderFormItem, index, { ...current, isHide: e === 3 })
      // this.renderFormItem[index] = {... this.renderFormItem[index], isHide: e=== 3}
    }
  }
}
</script>

<style lang="scss" scoped></style>
