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
      <avue-crud
        ref="crud"
        v-if="reload"
        :page.sync="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @search-change="searchChange"
        @refresh-change="refreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @row-del="handleDel"
      >
        <template slot="menuLeft">

        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  getTableConfig,
  getTableData,
  getTableMetaData,
  delTableData,
  addTableData,
  updateTableData
} from '@/api/gen/dynamic'
import {getStore, setStore} from '@/util/store'
import {mapGetters} from 'vuex'
import website from "@/const/website.js";

export default {
  data() {
    return {
      tableName: undefined,
      dsName: undefined,
      searchForm: {},
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: {},
      reload: false
    };
  },
  mounted() {
    const parseWithFunctions = (obj) => {
      return JSON.parse(obj, (key, val) => {
        if (key === 'onLoad') {
          return new Function("return " + val + ";").apply(this);
        }
        return val;
      });
    };

    // 从localstore 中获取配置，开发过程中建议关闭
    let cacheKey = `${this.dsName}_${this.tableName}_config`
    let cacheConfig = getStore({name: cacheKey})
    if (cacheConfig && website.dynamicCodeCache) {
      this.tableOption = parseWithFunctions(cacheConfig);
      this.reload = true
      return
    }

    getTableConfig(this.tableName, this.dsName).then((res) => {
      this.tableOption = parseWithFunctions(res.data.data);
      this.reload = true
      setStore({
        name: cacheKey,
        content: res.data.data
      })
    });
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      let defaultPers = !!this.permissions["gen_api_designer"]
      return {
        addBtn: this.vaildData(this.permissions[`${this.dsName}/${this.tableName}/save`], defaultPers),
        delBtn: this.vaildData(this.permissions[`${this.dsName}/${this.tableName}/delete`], defaultPers),
        editBtn: this.vaildData(this.permissions[`${this.dsName}/${this.tableName}/update`], defaultPers)
      };
    }
  },
  created() {
    this.tableName = this.$route.params.tableName
    this.dsName = this.$route.params.dsName
    this.getList(this.page);
  },
  methods: {
    // 列表查询
    getList(page, params) {
      this.tableLoading = true;
      getTableData(this.tableName, this.dsName, Object.assign(
        {
          page: page.currentPage,
          size: page.pageSize
        },
        params,
        {query: this.searchForm}
      )).then((res) => {
        res.data.data.records ? this.tableData = res.data.data.records : this.tableData = []
        this.page.total = res.data.data.total;
        this.tableLoading = false;
      }).catch(() => {
        this.tableLoading = false;
      });
    },
    // 删除
    handleDel: function (row) {
      // 获取主键
      getTableMetaData(this.tableName, this.dsName).then((res) => {
        delTableData(this.tableName, this.dsName, row[res.data])
          .then(() => {
            this.refreshChange();
          }).catch(() => {
        });
      })
    },
    // 更新
    handleUpdate: function (row, index, done, loading) {
      for (let key in row) {
        if (key.indexOf("$") >= 0) {
          delete row[key]
        }
      }
      updateTableData(this.tableName, this.dsName, row).then(() => {
        this.refreshChange();
        done();
      }).catch(() => {
        loading();
      });
    },
    // 保存
    handleSave: function (row, done, loading) {
      for (let key in row) {
        if (key.indexOf("$") >= 0) {
        }
      }
      addTableData(this.tableName, this.dsName, row).then(() => {
        this.refreshChange();
        done();
      }).catch(() => {
        loading();
      });
    },
    // 每页条数改变事件
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.getList(this.page);
    },
    // 当前页发生改变事件
    currentChange(current) {
      this.page.currentPage = current;
      this.getList(this.page);
    },
    // 查询事件
    searchChange(form, done) {
      this.searchForm = form;
      this.page.currentPage = 1;
      this.getList(this.page, form);
      done();
    },
    // 刷新事件
    refreshChange() {
      this.getList(this.page);
    }
  },
};
</script>

