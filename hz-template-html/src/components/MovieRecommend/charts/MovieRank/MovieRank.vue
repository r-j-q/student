<template>
  <div class="MovieRank w100 h100 pd-20" v-if="tableData">
    <div class="title pd-bottom-10 fw-600 f20">电影排行榜:</div>
    <base-table
      :tableData="tableData"
      :tableColumnOptions="tableColumnOptions"
      :table_cell_height="33"
      :header_cell_height="35"
      :body_cell_style="{
        backgroundColor: 'transparent',
        color: '#3cc5e4',
        fontSize: '16px',
      }"
      :header_cell_style="{
        backgroundColor: 'transparent',
        color: '#3cc5e4',
        fontSize: '18px',
        fontWeight: 600,
      }"
      :fyData="fyData"
      :pageSize="[10]"
      :fy="true"
      @checkPage="checkPage"
      loadMore
      @loadMore="loadMore"
      @cellClick="click"
    >
      <template slot-scope="scope" slot="img">
        <div class="demo-image__preview h100">
          <el-image
            fit="cover"
            class="h100"
            :src="scope.row.icon"
            :preview-src-list="[scope.row.icon]"
          ></el-image>
        </div>
      </template>
      <template slot-scope="scope" slot="btn">
        <div class="w100 h100 fx-center">
          <el-button
            style="width: 80px; height: 30px; line-height: 10px"
            @click.stop="goMovie(scope.row.link)"
            type="primary"
            >去观影</el-button
          >
        </div>
      </template>
    </base-table>
  </div>
</template>
<script>
import { getAdsDouban } from "@/api/MovieRecommend/bigScreen";
export default {
  data() {
    return {
      tableData: null, // 表格数据
      tableColumnOptions: [
        // 表格列配置数据
        {
          label: "排名",
          prop: "id",
          width: 80,
        },
        {
          label: "名称",
          prop: "name",
          tooltip: true,
        },
        {
          label: "图片",
          prop: "icon",
          slot: "img",
          width: 120,
        },
        {
          label: "类型",
          prop: "type",
          width: 120,
        },
        {
          label: "评分",
          prop: "score",
          width: 120,
        },
        {
          label: "国家",
          prop: "country",
          width: 80,
        },
        {
          label: "年份",
          prop: "years",
          width: 120,
        },
        {
          label: "时长(分钟)",
          prop: "times",
          width: 120,
        },
        {
          label: "影片链接",
          prop: "link",
          slot: "btn",
          width: 120,
        },
      ],
      fyData: {},
    };
  },
  mounted() {
    getAdsDouban({ size: 10, page: 1 }).then((res) => {
      this.tableData = res.data.data;
      this.fyData = {
        page: res.data.page, // 当前页面
        size: res.data.size, // 每页数量
        total: res.data.totalSize, // 数据总量
      };
    });
  },
  methods: {
    click(e) {
      this.eventBus.$emit("wordCloud", e.id);
    },
    goMovie(e) {
      window.open(e);
    },
    loadMore(v) {
      getAdsDouban({ size: v.size, page: v.page }).then((res) => {
        this.tableData.push(...res.data.data);
      });
    },
    checkPage(v) {
      getAdsDouban({ size: v.size, page: v.page }).then((res) => {
        this.tableData = res.data.data;
        this.fyData = {
          page: res.data.page, // 当前页面
          size: res.data.size, // 每页数量
          total: res.data.totalSize, // 数据总量
        };
      });
    },
  },
};
</script>
<style lang="less" scoped>
.title {
  color: var(--col-main);
}
</style>
