<template>
  <div class="GreadStatistics w100 h100 pd-20">
    <div class="w100 h100" id="GreadStatistics"></div>
  </div>
</template>

<script>
// 引入api
import { getAdsDoubanScore } from "@/api/MovieRecommend/bigScreen";
// 引入饼状图纹理
import piebg from "./img/piebg.png";
export default {
  data() {
    return {
      myChart: null,
      option: null,
      data: null, // 页面数据
      all: 0, // 总数
    };
  },
  mounted() {
    getAdsDoubanScore()
      .then((res) => {
        let data = res.data.data;
        this.all = data.reduce((sum, item) => {
          return (sum += item.counts);
        }, 0);
        /**
         * @this._order 参数1是需要排序的对象, 参数2是排序依据对象中数值的key值, 参数3是排序方式,desc降序, asc升序,lenDesc根据属性值的length属性降序排列
         */
        this._order(data, "counts", "desc");
        this.data = data;
        this.draw();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    draw() {
      let myChart = this.$echarts.init(
        document.getElementById("GreadStatistics"),
        "transLight_5"
      );
      this.myChart = myChart;
      let echarts = this.$echarts;
      this.option = {
        title: {
          // 图表标题配置
          text: "电影评分分析:",
          left: 0,
          top: 0,
          textStyle: {
            color: this.color.main,
          },
        },
        legend: {
          // 图例的配置
          type: "scroll", // 开启 scroll
          orient: "vertical", // 横向还是竖向
          right: "right", // 位置
          pageIconColor: "#3cc5e4",
          pageTextStyle: {
            color: "#3cc5e4",
          },
        },
        tooltip: {
          trigger: "item", // 触发条件
          valueFormatter: (val) => {
            // 提示框值得格式
            return ((val / this.all) * 100).toFixed(2) + "%";
          },
        },
        dataset: {
          source: this.data, // 数据源
        },
        series: [
          {
            name: "评分占比:", // tooltip 的标题将默认显示name的值
            type: "pie",
            radius: ["10%", "80%"], // 扇形中心,扇形外圈的大小
            center: ["40%", "55%"], // 饼状图的位置
            roseType: "area", // 注释掉就是普通的饼状图, 不注释就是南丁格尔图
            label: {
              // 扇区标题的样式配置
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              overflow: "none", // 溢出不隐藏
            },
            //图形配置
            itemStyle: {
              borderRadius: 8, // 每个扇区的 Radius
              // color: {      // 为扇区绘制纹理
              //   image: piebg,
              //   repeat: "repeat",
              // },
              // opacity: 0.7,
              // borderWidth: 3,
              // borderColor: "#235894",
            },
            encode: {
              // 在这里指定数据映射规则
              itemName: "title", // 扇区标题
              value: "counts", // 扇区的值,(Number)
            },
          },
        ],
      };
      myChart.setOption(this.option);
      myChart.on("click", (e) => {
        console.log(e);
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
