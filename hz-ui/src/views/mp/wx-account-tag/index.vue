<!--
  -    Copyright (c) 2018-2025, hz All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: hz
  -->
<template>
  <div class="execution">
    <basic-container>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-select v-model="q.wxAccountAppid" placeholder="请选择公众号">
              <el-option
                v-for="item in wxAccountList"
                :key="item.appid"
                :label="item.name"
                :value="item.appid"/>
            </el-select>
          </div>
        </el-col>

        <el-col :span="16">
          <div class="grid-content bg-purple">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button v-if="permissions.mp_wx_account_tag_sync"  type="primary" icon="el-icon-sort" @click="asyncTags">
              同步
            </el-button>
          </div>
        </el-col>
      </el-row>
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @size-change="sizeChange"
        @current-change="currentChange"
        @refresh-change="refreshChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="rowDel"/>
    </basic-container>
  </div>
</template>

<script>
import {addObj, delObj, putObj, getPage,sync} from '@/api/mp/wx-account-tag'
import {fetchAccountList} from "@/api/mp/wx-account"
import {tableOption} from '@/const/crud/mp/wx-account-tag'
import {mapGetters} from 'vuex'

export default {
  name: 'WxAccountTag',
  data() {
    return {
      q: {},
      tableData: [],
      wxAccountList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.mp_wx_account_tag_add, false),
        delBtn: this.vaildData(this.permissions.mp_wx_account_tag_del, false),
        editBtn: this.vaildData(this.permissions.mp_wx_account_tag_edit, false)
      }
    }
  },
  created() {
    this.getAccountList()
  },
  methods: {
    getAccountList() {
      fetchAccountList().then(response => {
        this.wxAccountList = response.data.data
        // 默认选中第一个
        if (this.wxAccountList.length > 0) {
          this.q.wxAccountAppid = this.wxAccountList[0].appid
        }
      })
    },
    getList(page, params) {
      this.tableLoading = true
      getPage(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    rowDel: function (row, index) {
      const _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row)
      }).then(() => {
        _this.tableData.splice(index, 1)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getList(this.page)
      }).catch(function () {
      })
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done) {
      putObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        done()
        this.getList(this.page)
      }).catch(() => {
        done()
      })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done) {
      row.wxAccountAppid = this.q.wxAccountAppid
      addObj(row).then(() => {
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
        this.getList(this.page)
      }).catch(() => {
        done()
      })
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    refreshChange() {
      this.getList(this.page)
    },
    search() {
      this.getList(this.page, this.q)
    },
    asyncTags() {
      if (this.q.wxAccountAppid) {
        sync(this.q.wxAccountAppid).then(() => {
          this.$message({
            showClose: true,
            message: '已开始从微信同步标签信息，建议等待后查询',
            type: 'success'
          })
        })
        this.getList(this.page)
      } else {
        this.$message.error('请选择公众号')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
