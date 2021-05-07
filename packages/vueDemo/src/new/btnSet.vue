<template>
  <el-dialog
    width="500px"
    title="按钮设置"
    :visible="visible"
    custom-class="mediate-dialog"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form
      ref="elFormRef"
      :model="formObj"
      :rules="rules"
      size="small"
      label-width="90px"
    >
      <template v-for="data in formData">
        <el-form-item
          :key="'key_' + data.key"
          label="key"
          :prop="'key_' + data.key"
          style="display: none"
        >
          <el-input v-model="formObj['key_' + data.key]" disabled />
        </el-form-item>
        <el-form-item
          :key="'status_' + data.key"
          label="按钮状态"
          :prop="'status_' + data.key"
        >
          <el-input v-model="formObj['status_' + data.key]" disabled />
        </el-form-item>
        <el-form-item
          :key="'name_' + data.key"
          label="按钮名称"
          :prop="'name_' + data.key"
        >
          <el-input v-model="formObj['name_' + data.key]" />
        </el-form-item>
        <el-form-item
          :key="'url_' + data.key"
          label="跳转地址"
          :prop="'url_' + data.key"
        >
          <el-input v-model="formObj['url_' + data.key]" />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { btnStatusMap } from '@/config/dict'

export default {
  name: 'BtnSet',
  data() {
    return {
      formData: [],
      formObj: {},
      visible: false,
      rules: {
        status_1: [{ message: '请输入按钮状态', trigger: 'blur' }],
        status_2: [{ message: '请输入按钮状态', trigger: 'blur' }],
        status_3: [{ message: '请输入按钮状态', trigger: 'blur' }],
        name_1: [{ message: '请输入按钮名称', trigger: 'blur' }],
        name_2: [{ message: '请输入按钮名称', trigger: 'blur' }],
        name_3: [{ message: '请输入按钮名称', trigger: 'blur' }],
        url_1: [{ message: '请输入跳转地址', trigger: 'blur' }],
        url_2: [{ message: '请输入跳转地址', trigger: 'blur' }],
        url_3: [{ message: '请输入跳转地址', trigger: 'blur' }]
      }
    }
  },

  methods: {
    onShow(data = []) {
      // 外部调用显示
      this.visible = true
      this._formatReceiveData(data)
      return new Promise(resolve => {
        this.resolve = resolve
      })
    },

    handleClose() {
      // 关闭弹窗
      this.visible = false
      this.resolve(null)
    },

    handleSubmit() {
      // 保存
      this.$refs.elFormRef.validate(valid => {
        if (valid) {
          const data = this._formSendData()
          this.visible = false
          this.resolve(data)
        }
      })
    },

    _formatReceiveData(data) {
      // 格式化接收到数据
      const formData = []
      let formObj = {}
      btnStatusMap.forEach((item, index) => {
        const current = data.find(e => e.status === item.value)
        const { key, value } = item
        const { name, url } = current || {}
        formData.push({
          key,
          status: value,
          name: name,
          url: url
        })
        formObj = {
          ...formObj,
          ['key_' + key]: key,
          ['status_' + key]: value,
          ['name_' + key]: name,
          ['url_' + key]: url
        }
      })
      this.formData = formData
      this.formObj = formObj
    },

    _formSendData() {
      // 格式化保存数据
      const data = this.formObj
      const sendData = [{}, {}, {}]
      const keys = Object.keys(data)
      keys.forEach(item => {
        const [key, num] = item.split('_')
        sendData[num - 1][key] = data[item]
      })
      return sendData
    }
  }
}
</script>

<style lang="scss" scoped></style>
