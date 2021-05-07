<template>
  <div class="app-page">
    <div class="content">
      <table-search :search-form="queryFormItem" :on-submit="handleQuery" :on-reset="handleQuery">
        <div slot="new-add-button" style="line-height:45px;">
          <auth-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            authkey="e_1_1"
            @click="handleAdd"
          >
            添加
          </auth-button>
        </div>
      </table-search>
      <el-card>
        <TablePaging
          border
          :table-list="couponList"
          :table-column="couponTableColumn"
          :table-buttons="couponTableButtons"
          :table-btn-width="180"
          :table-paging="couponTablePaging"
          :table-total="couponTableTotal"
          @pagingChange="handlePaginChange"
        />
      </el-card>
    </div>
    <coupon-update
      v-if="dialogVisible"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="() => (dialogVisible = false)"
      :handle-submit="handleModalSubmit"
      :form-data="modalFormData"
      width="620px"
    />
    <template v-if="couponVisble">
      <el-dialog
        append-to-body
        :activerecord-id="couponRecordId"
        title="卡券使用说明"
        width="1100px"
        :visible="couponVisble"
        :before-close="() => (couponVisble = false)"
      >
        <active-introduce :id="couponRecordId" :type="couponType" />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="couponVisble = false">关 闭</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import {
  fetchCouponAdd,
  fetchCouponUpdate,
  fetchCouponGet,
  fetchCouponFindPage,
  fetchCouponDelete
} from '@/api/coupon/couponmanage'
import CouponUpdate from './update'
import { TableSearch, TablePaging, AuthButton, ActiveIntroduce } from '@/components'
import { queryFormItem, tableColumn } from './config'

export default {
  name: 'Activity',
  components: { TablePaging, TableSearch, CouponUpdate, AuthButton, ActiveIntroduce },
  data() {
    return {
      couponType: '',
      couponVisble: false,
      couponRecordId: '',
      queryFormData: {},
      queryFormItem,
      couponTableColumn: tableColumn(1, 10),
      couponList: [],
      couponTableButtons: [
        // 操作按钮
        {
          name: '修改',
          authkey: 'e_1_2',
          click: this.handleEdit
        },
        {
          name: '卡券介绍',
          authkey: 'e_1_4',
          click: this.handleCoupon
        },
        {
          name: '删除',
          authkey: 'e_1_3',
          confirm: '确认删除?',
          click: this.handleDelete
        }
      ],
      couponTableTotal: 0,
      couponTablePaging: {
        page: 1,
        pagesize: 10
      },

      dialogTitle: '添加', // 弹窗标题
      dialogVisible: false, // 弹窗显示隐藏
      modalFormData: {} // 弹窗表单数据
    }
  },
  created() {
    this.postFindPage()
  },
  methods: {
    handleCoupon(id) {
      this.couponRecordId = id
      this.couponVisble = true
      this.couponType = '3'
    },
    handleQuery(values) {
      // 查询点击
      this.queryFormData = values
      this.couponTablePaging = {
        page: 1,
        pagesize: 10
      }
      this.postFindPage()
    },

    handleAdd() {
      // 新增
      this._setModalData()
    },
    handleEdit(id) {
      // 修改
      fetchCouponGet({ id }).then(res => {
        this._setModalData('修改', true, res)
      })
    },
    handleDelete(id) {
      this.postDeviceDelete(id)
    },
    handleModalSubmit(values) {
      // 处理逗号问题
      values.checkPhones = values.checkPhones ? values.checkPhones.replace(/，/ig, ',') : ''
      // 弹窗表单提交
      if (values.id) {
        this.postAccountUpdate(values)
        return false
      }
      this.postAccountAdd(values)
    },
    handlePaginChange(pageInfo) {
      // 分页改变
      this.couponTablePaging = pageInfo
      this.postFindPage()
      const { page, pagesize } = pageInfo
      this.couponTableColumn = tableColumn(page, pagesize)
    },
    _setModalData(title = '添加', visible = true, formData = { wxCard: false }) {
      // 设置弹窗
      this.modalFormData = formData
      this.dialogTitle = title
      this.dialogVisible = visible
    },
    postFindPage() {
      // 获取列表
      fetchCouponFindPage({
        ...this.queryFormData,
        ...this.couponTablePaging
      }).then(res => {
        const { records, current, size, total } = res
        this.couponList = records
        this.couponTablePaging = {
          page: current,
          pagesize: size
        }
        this.couponTableTotal = total
      })
    },
    postAccountAdd(values) {
      // 人员新增
      fetchCouponAdd(values).then(res => {
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.postFindPage()
      })
    },
    postAccountUpdate(values) {
      // 人员更新
      fetchCouponUpdate(values).then(() => {
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.postFindPage()
      })
    },
    postDeviceDelete(id) {
      // 人员删除
      fetchCouponDelete({ id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.postFindPage()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
