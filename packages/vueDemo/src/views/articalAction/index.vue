<template>
  <div class="app-page">
    <div class="content">
      <table-search
        :search-form="queryFormItem"
        :on-submit="handleQuery"
        :on-reset="handleQuery"
      >
        <div slot="new-add-button" style="line-height:45px;">
          <!-- <auth-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            auth-key="d_1_1"
            @click="handleAdd"
          >
            添加
          </auth-button> -->
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>

        </div>
      </table-search>
      <el-card shadow="never">
        <TablePaging
          border
          :table-list="rightList"
          :table-column="rightTableColumn"
          :table-buttons="rightTableButtons"
          :table-btn-width="180"
          :table-paging="deviceTablePaging"
          :table-total="deviceTableTotal"
          @pagingChange="handlePaginChange"
        />
      </el-card>
    </div>

    <device-update
      v-if="dialogVisible"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="() => (dialogVisible = false)"
      :handle-submit="handleModalSubmit"
      :form-data="modalFormData"
      width="620px"
    />
  </div>
</template>

<script>
import {
  fetchArticleFindPage,
  fetchArticleUpdate,
  fetchArticleAdd,
  fetchArticleGet,
  fetchArticleDelete
} from '@/api/artical/artical'
// import { fetchSelectRightsType } from '@/api/common/common'
import { TableSearch, TablePaging } from '@/components'
import DeviceUpdate from './update'
import { queryFormItem, tableColumn } from './config'

export default {
  name: 'Onwer',
  components: { DeviceUpdate, TablePaging, TableSearch },
  data() {
    return {
      queryFormData: {},
      queryFormItem,
      rightsTypeList: [],
      rightTableColumn: tableColumn(1, 10),
      rightList: [],
      rightTableButtons: [
        // 人员管理操作按钮
        {
          name: '修改',
          authkey: 'd_1_2',
          click: this.handleEdit
        },
        {
          name: '删除',
          confirm: '确认删除？',
          authkey: 'd_1_3',
          click: this.handleDelete
        }
      ],

      deviceTableTotal: 0,
      deviceTablePaging: {
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
  mounted() {
  },
  methods: {
    handleQuery(values) {
      console.log(values);
      // 查询点击
      this.queryFormData = values
      this.deviceTablePaging = {
        page: 1,
        pagesize: 10
      }
      this.postFindPage()
    },

    handleAdd() {
      // 新增
      this._setModalData('添加', true, { showPage: false, type: 1, status: 1 })
    },

    handleEdit(id) {
      // 修改
      fetchArticleGet({ id }).then(res => {
        // this._setModalData('修改', true, res)
      })
    },

    handleDelete(id) {
      this.postDeviceDelete(id)
    },

    handleModalSubmit(values) {
      // 弹窗表单提交
      if (values.id) {
        this.postAccountUpdate(values)
        return false
      }
      this.postAccountAdd(values)
    },

    handlePaginChange(pageInfo) {
      // 分页改变
      this.deviceTablePaging = pageInfo
      this.postFindPage()
      const { page, pagesize } = pageInfo
      this.rightTableColumn = tableColumn(page, pagesize)
    },

    _setModalData(title = '添加', visible = true, formData = {}) {
      // 设置弹窗
      this.modalFormData = formData
      this.dialogTitle = title
      this.dialogVisible = visible
    },

    postFindPage() {
      // 获取列表
      fetchArticleFindPage({
        ...this.queryFormData,
        ...this.deviceTablePaging
      }).then(res => {
        // const { records, current, size, total } = res
        // this.rightList = records
        // this.deviceTablePaging = {
        //   page: current,
        //   pagesize: size
        // }
        // this.deviceTableTotal = total
      })
    },

    postAccountAdd(values) {
      // 文章新增
      fetchArticleAdd(values).then(res => {
        // this.dialogVisible = false
        // this.$message({
        //   type: 'success',
        //   message: '添加成功'
        // })
        // this.postFindPage()
      })
    },

    postAccountUpdate(values) {
      // 文章更新
      fetchArticleUpdate(values).then(() => {
        this.dialogVisible = false
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.postFindPage()
      })
    },

    postDeviceDelete(id) {
      // 文章删除
      fetchArticleDelete({ id }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.postFindPage()
      })
    }
    // postRightsTypelList() {
    //   fetchSelectRightsType().then(res => {
    //     this.rightsTypeList = res.map(e => ({
    //       key: e.id,
    //       value: e.name
    //     }))
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped></style>
