<template>
  <div class="base-table">
    <div :class="['table', rowGap ? 'row-gap' : '']">
      <el-table
        :key="tableHeight"
        :height="tableHeight || 'auto'"
        ref="multipleTable"
        border
        :data="tableData"
        tooltip-effect="light"
        style="width: 100%"
        headpromiseer-cell-class-name="header-cell"
        row-class-name="table-row"
        cell-class-name="table-cell"
        @selection-change="handleSelectionChange"
        :header-cell-style="{
          height: header_cell_height + 'px',
          ...header_cell_style,
        }"
        :cell-style="{ height: table_cell_height + 'px', ...body_cell_style }"
        :span-method="spanMethod"
        @cell-click="cellClick"
      >
        <el-table-column v-if="selection" type="selection"> </el-table-column>
        <template v-for="(item, index) of tableColumnOptions">
          <el-table-column
            :key="index"
            class-name="slot"
            v-if="item.slot"
            :label="item.label"
            :width="item.width || ''"
          >
            <template slot-scope="scope">
              <div
                class="slot"
                :style="{ height: table_cell_height - 4 + 'px' }"
              >
                <slot :name="item.slot" :row="scope.row"></slot>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            v-else
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="item.tooltip"
            :width="item.width || ''"
          >
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="btn" v-if="loadMore && tableData.length">
      <el-image v-show="loading" :src="require('./img/loading.png')"></el-image>
      <el-button
        v-show="!loading"
        :disabled="fyData.size * fyData.page >= fyData.total"
        @click="loadMore_"
        type="text"
        >加载更多
      </el-button>
    </div>
    <footer>
      <div class="check-box">
        <div v-if="selection">
          <el-checkbox @change="checkAll" v-model="isCheckAll"
            >全部</el-checkbox
          >
          <div class="text">选中{{ multipleSelection.length }}条</div>
        </div>
      </div>
      <div
        v-if="fy"
        class="paging"
        :style="{ paddingTop: loadMore ? '10px' : '30px' }"
      >
        <el-pagination
          :pager-count="5"
          :disabled="!Boolean(fyData.total)"
          @size-change="getSize"
          @current-change="getPage"
          :current-page.sync="page"
          :page-sizes="pageSize"
          :page-size="fyData.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="fyData.total"
        >
        </el-pagination>
      </div>
    </footer>
  </div>
</template>

<script>
import { getRowspanMethod } from "./js/common";

export default {
  name: "BaseTable",
  data() {
    return {
      timer: 0,
      isCheckAll: false,
      loading: false,
      timer: 0,
      page: 0,
    };
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    selection: {
      type: Boolean,
      default() {
        return false;
      },
    },
    multipleSelection: {
      type: Array,
      default() {
        return [];
      },
    },
    tableColumnOptions: {
      type: Array,
      required: true,
    },
    table_cell_height: {
      // 表格内容行高
      type: Number,
      default: 80,
    },
    header_cell_height: {
      // 表头行高
      type: Number,
      default: 50,
    },
    header_cell_style: {
      // 表头背景色
      type: Object,
      default: {
        backgroundColor: "white",
        color: "#333333",
        fontSize: "14px",
      },
    },
    body_cell_style: {
      type: Object,
      default() {
        return {
          backgroundColor: "white",
          color: "#333333",
          fontSize: "14px",
        };
      },
    },
    fy: {
      type: Boolean,
      default() {
        return false;
      },
    },
    fyData: {
      type: Object,
      default() {
        return {
          size: undefined,
        };
      },
    },
    pageSize: {
      type: Array,
      default() {
        return [10, 15, 20, 25, 30];
      },
    },
    loadMore: {
      type: Boolean,
      default() {
        return false;
      },
    },
    rowspanArray: {
      type: Array,
      default() {
        return [];
      },
    },
    rowGap: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  computed: {
    spanMethod() {
      return getRowspanMethod(this.tableData, this.rowspanArray);
    },
    tableHeight() {
      return (
        (this.$props.table_cell_height + 2) *
          (this.$props.fyData.size || this.$props.tableData.length) +
        this.$props.header_cell_height +
        4 +
        (this.$props.rowGap
          ? 20 * (this.$props.fyData.size || this.$props.tableData.length) + 20
          : 0)
      );
    },
  },
  watch: {
    multipleSelection(v) {
      v.length >= this.tableData.length
        ? (this.isCheckAll = true)
        : (this.isCheckAll = false);
    },
    tableData(v) {
      this.multipleSelection.length >= v.length
        ? (this.isCheckAll = true)
        : (this.isCheckAll = false);
      this.loading = false;
    },
    "fyData.page"(v) {
      this.page = v;
    },
    // 监听路由前进回退
    "$route.query.p"(v) {
      let timer = new Date().getTime();
      if (timer - this.timer <= 200) {
        return;
      }
      this.timer = timer;
      if (v) this.getPage(Number(v), true);
    },
  },
  mounted() {
    this.page = this.$props.fyData.page;
  },
  created() {
    this.timer = new Date().getTime();
    if (this.fyData) {
      let p = Number(this.$route.query.p);
      if (p) {
        let timer = setInterval(() => {
          if (this.fyData.page) {
            this.$emit("checkPage", {
              page: p * 1 || 1,
              total: this.fyData.total,
              size: this.fyData.size,
            });
            this.page = p * 1 || 1;
            this.fyData.page = p * 1 || 1;
            clearInterval(timer);
          }
        }, 50);
      }
    }
  },
  methods: {
    cellClick(e) {
      this.$emit("cellClick", e);
    },
    handleSelectionChange(e) {
      this.$emit("update:multipleSelection", e);
    },
    checkAll() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    getSize(e) {
      this.fyData.size = e;
      this.$emit("update:fyData", this.fyData);
      this.$emit("checkPage", this.fyData);
    },
    loadMore_() {
      let timer = new Date().getTime();
      if (timer - this.timer < 300) return;
      this.loading = true;
      this.$route.query.p = this.page + 1;
      this.getPage(this.page + 1, true, true);
    },
    getPage(p, back = false, loadMore = false) {
      let timer = new Date().getTime();
      // 节流500
      if (timer - this.timer > 500) {
        this.timer = timer;
      } else {
        this.page = this.$props.fyData.page;
        this.loading = false;
        return;
      }
      if (Number(this.$route.query.p) === p && !back) return;
      this.timer = new Date().getTime();
      this.$emit("update:fyData", {
        page: p,
        total: this.fyData.total,
        size: this.fyData.size,
      });
      this.$props.fyData.page = p;
      let query = Object.assign(JSON.parse(JSON.stringify(this.$route.query)), {
        p,
      });
      if (!back) this.$router.push({ query });
      if (loadMore) {
        this.$emit("loadMore", this.fyData);
        return;
      }
      this.$emit("checkPage", this.fyData);
    },
  },
};
</script>
<style>
:root {
  /* 表格文字颜色 */
  --table-col-text: #00fff7;
  /* 表格背景色 */
  --table-bg: transparent;
  /* 鼠标移入背景 */
  --table-hover-bg: rgba(60, 197, 228, 0.6);
  /* 选中项文字颜色 */
  --table-active-colr: #125d7f;
  /* 表格边框颜色 */
  --table-border-color: #3cc5e4;
  /* 表格边框宽度 */
  --table-border-width: 1px;
}
.el-tooltip__popper.is-light {
  max-width: 60vw;
}
</style>
<style lang="less" scoped>
@keyframes loding {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

.base-table {
  user-select: none;
  width: 100%;

  .row-gap ::v-deep {
    .el-table__body {
      border-spacing: 0px 20px;
      margin-top: -20px;
    }
  }

  > .table {
    .el-table::v-deep {
      border: 0 !important;
      margin-bottom: -20px;
      background-color: transparent !important;
      tr {
        background-color: transparent;
      }
      .is-scrolling-none {
        height: 100% !important;
        &::-webkit-scrollbar {
          background-color: var(--table-bg);
          width: 5px !important;
        }
        &::-webkit-scrollbar-thumb {
          background-color: var(--table-active-colr);
        }
      }
      .el-table__cell.gutter {
        background-color: var(--table-bg);
        border-color: var(--table-bg);
      }
      table {
        width: auto !important;
      }
      .el-table__body {
        margin-bottom: 60px;
      }
      thead {
        .el-table__cell {
          text-align: center;
          border: var(--table-border-width) solid var(--table-border-color);
          font-size: 14px;
          font-weight: 400;
        }
      }
      .table-cell,
      .header-cell {
        text-align: center;
        border: var(--table-border-width) solid var(--table-border-color);
        font-size: 14px;
        font-weight: 400;
      }
      .table-row:hover {
        td {
          background-color: var(--table-hover-bg) !important;
        }
      }
      .table-cell {
        padding: 0;
        overflow: hidden;
        border-width: var(--table-border-width);
        border-color: var(--table-border-color);
        > .cell {
          .slot {
            width: 100%;
            position: relative;
          }
        }
      }

      .table-cell.slot {
        > .cell {
          padding: 0;
        }
      }
    }
    .el-table--border::after {
      background-color: transparent !important;
    }
    .el-table::before {
      height: 0px;
    }
    ::v-deep .el-checkbox__inner {
      background-color: var(--table-bg) !important;
      &::after {
        border-width: 1px;
        border-style: solid;
        border-top-color: transparent;
        border-left-color: transparent;
        border-bottom-color: var(--table-active-colr);
        border-right-color: var(--table-active-colr);
      }
    }
  }
  > footer {
    position: relative;

    > .check-box {
      position: absolute;
      left: 0;
      top: 0;
      flex-shrink: 0;
      .el-checkbox {
        color: var(--table-col-text);
        ::v-deep .el-checkbox__inner {
          background-color: var(--table-bg) !important;
          &::after {
            border-width: 1px;
            border-style: solid;
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: var(--table-active-colr);
            border-right-color: var(--table-active-colr);
          }
        }
        ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
          color: var(--table-active-colr) !important;
        }
      }

      > div {
        margin-top: 20px;
        margin-bottom: 20px;
        height: 14px;
        font-size: 14px;
        color: var(--table-col-text);
        font-weight: 400;
        display: flex;
        align-items: center;
        line-height: 14px;

        > .text {
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }

    > .paging::v-deep {
      display: flex;
      margin-right: 0;
      padding-bottom: 10px;
      justify-content: right;

      .el-pagination {
        height: 34px;
        line-height: 34px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;

        input,
        button,
        ul,
        li {
          height: 34px;
          font-size: 14px;
          box-sizing: border-box;
        }
        li {
          padding: 0;
          width: 34px;
          border: 1px solid #707070;
          line-height: 34px;
          border-radius: 4px;
          margin: 0px 2px;
          border: var(--table-border-width) solid var(--table-border-color);
          background-color: var(--table-bg);
          color: var(--table-col-text);
        }
        li.active {
          color: var(--table-active-colr);
        }
        .el-input {
          i::before,
          i::after {
            color: var(--table-col-text);

            font-size: 26px;
          }
          > input {
            height: 34px;
            border: var(--table-border-width) solid var(--table-border-color);
            border-radius: 4px;
          }
        }

        i::before {
          color: var(--table-col-text);
          font-size: 20px;
        }

        span {
          height: 34px;
          line-height: 34px;
          font-size: 14px;
          color: var(--table-col-text);
          margin: 0;

          > div {
            margin: 0px 0px;
          }
        }
        button {
          background-color: var(--table-bg);
          color: var(--table-col-text);
        }
        input {
          background-color: var(--table-bg);
          color: var(--table-col-text);
        }
      }
      .el-pagination .el-pagination__total {
        // display: none;
      }
      .el-pagination .el-pagination__sizes {
        // display: none;
      }
      .el-pagination.is-background .btn-prev {
        padding: 0 5px;
        background: none;
      }

      .el-pagination.is-background .btn-next {
        padding: 0 5px;
        background: none;

        border: 1px solid #dbdbdb;
      }

      .el-pagination.is-background .btn-prev {
        padding: 0 5px;
        background: none;
        border: 1px solid #dbdbdb;
      }

      .el-pagination.is-background .btn-next:hover {
        color: var(--col4E);
        border: 1px solid var(--col4E);
      }

      .el-pagination.is-background .btn-prev:hover {
        color: var(--col4E);
        border: 1px solid var(--col4E);
      }

      .el-pagination.is-background .el-pager li:not(.disabled) {
        background: none;
        font-size: 14px;
      }

      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: var(--table-bg);
        color: rgba(0, 0, 255, 0.5);
      }
    }
  }
  .btn {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;

    .el-button {
      color: var(--table-active-colr);
      font-size: 16px;
      line-height: 28px;
      padding-top: 20px;
      padding-bottom: 0;
      display: block;
    }

    .el-button:focus {
      color: var(--table-active-colr);
    }

    .el-button:hover {
      color: var(--table-active-colr);
      opacity: 0.9;
    }

    .el-button.is-disabled {
      color: #999999;
    }

    /deep/ .el-image {
      width: 30px !important;
      height: 30px !important;
      box-sizing: content-box;
      padding-top: 20px;
      > img {
        animation-timing-function: steps(12);
        animation-duration: 0.3s;
        animation-name: loding;
        animation-iteration-count: infinite;
      }
    }
  }
}
</style>
