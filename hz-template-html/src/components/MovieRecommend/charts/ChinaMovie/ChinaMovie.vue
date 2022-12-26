<template>
  <div class="ChinaMovie w100 h100 pd-20">
    <div class="w100 h100" id="ChinaMovie"></div>
  </div>
</template>

<script>
import { getAdsDoubanScorezg } from "@/api/MovieRecommend/bigScreen";
export default {
  data() {
    return {
      myChart: null,
      option: null,
      data: null, // 页面数据
    };
  },
  mounted() {
    getAdsDoubanScorezg()
      .then((res) => {
        let data = [];
        res.data.data.forEach((item) => {
          let temp = data.find((item_) => {
            return item_.years === item.years;
          });
          if (temp) {
            if (Number(temp.score) < Number(item.score)) {
              data.forEach((_item) => {
                if (_item.years === item.years) {
                  _item.score = item.score;
                }
              });
            }
          } else {
            data.push(item);
          }
        });
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
        document.getElementById("ChinaMovie"),
        "transLight_5"
      );
      this.myChart = myChart;
      let echarts = this.$echarts;
      this.option = {
        title: {
          text: "中国电影评分走势:",
          left: 0,
          top: 0,
          textStyle: {
            color: this.color.main,
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        grid: {
          left: 10,
          right: 10,
          top: 40,
          bottom: 30,
          containLabel: true,
        },
        dataset: {
          source: this.data,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 20,
            color: this.color.main,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            interval: 0,
            rotate: 0,
            color: this.color.main,
          },
        },
        series: [
          {
            name: "电影评分",
            type: "line",
            smooth: true,
            encode: {
              x: 1,
              y: 2,
            },
          },
        ],
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            filterMode: "filter",
            start: 0,
            end: 20,
          },
          {
            type: "slider",
            xAxisIndex: [0],
            filterMode: "filter",
            start: 0,
            end: 20,
            bottom: 10,
            height: 20,
          },
        ],
      };
      myChart.setOption(this.option);
      if (this.data.length > 0) {
        let option = this.option;
        this.timer = setInterval(() => {
          // 每次向后滚动一个，最后一个从头开始。
          if (option.dataZoom[0].end > 100) {
            option.dataZoom[0].end = 20;
            option.dataZoom[0].start = 0;
          } else {
            option.dataZoom[0].end += 2;
            option.dataZoom[0].start += 2;
          }
          myChart.setOption(option);
        }, 1500);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
