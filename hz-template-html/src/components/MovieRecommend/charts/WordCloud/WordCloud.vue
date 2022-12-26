<template>
  <div class="WordCloud w100 h100 pd-20">
    <div class="" id="WordCloud"></div>
  </div>
</template>
<script>
// 引入api
import { getHotwords } from "@/api/MovieRecommend/bigScreen";
// 引入图片, 用于绘制cloud图形
import img from "./img/cloud.png";
export default {
  data() {
    return {
      img,
      myChart: null,
      option: null,
      /**
       * @data 词云数据
       * [
       *  {
       *     name:String, // 词语
       *     value:Number,  // 词语出现次数
       *  }
       * ]
       */
      data: null,
    };
  },
  mounted() {
    /**
     * 使用事件车接收其它组件发出的 切换词云的消息
     * 当前项目词云是使用`commodity_id`向后端请求不同词云
     * 在收到更新词云的消息时, 销毁当前的chart, 重新加载新词云
     * 发送词语使用事件车:
     * this.$emit
     * (此处的eventBus是在main.js中注册的独立Vue对象)
     */
    this.eventBus.$on("wordCloud", (e) => {
      this.myChart.dispose();
      this.getData(e);
    });
    this.getData();
  },
  methods: {
    getData(id = undefined) {
      getHotwords(id ? { commentId: id } : { commentId: 1 })
        .then((res) => {
          // 整理数据格式
          let data = res.data.data.map((item) => {
            delete item.comment_id;
            return item;
          });
          this.data = data;
          this.draw();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    draw() {
      let img = new Image();
      img.src = this.img;
      let myChart = this.$echarts.init(
        document.getElementById("WordCloud"),
        "transLight_5"
      );
      this.myChart = myChart;
      let echarts = this.$echarts;
      this.option = {
        // 组件标题配置
        title: {
          text: "词云:",
          left: 0,
          top: 0,
          textStyle: {
            color: this.color.main,
            fontSize: 50,
          },
        },
        series: [
          {
            type: "wordCloud",

            // The shape of the "cloud" to draw. Can be any polar equation represented as a
            // callback function, or a keyword present. Available presents are circle (default),
            // cardioid (apple or heart shape curve, the most known polar equation), diamond (
            // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

            shape: "circle",

            // Keep aspect ratio of maskImage or 1:1 for shapes
            // This option is supported since echarts-wordcloud@2.1.0
            keepAspect: false,

            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.

            maskImage: img,

            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.

            left: "center",
            top: "center",
            width: "100%",
            height: "130%",
            right: null,
            bottom: null,
            /**
             * @sizeRange 映射词语大小
             * 默认 12~60
             */
            sizeRange: [36, 180],

            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

            rotationRange: [-90, 90],
            rotationStep: 45,

            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.

            gridSize: 8,

            // set to true to allow word to be drawn partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            // This option is supported since echarts-wordcloud@2.1.0
            drawOutOfBound: false,

            // if the font size is too large for the text to be displayed,
            // whether to shrink the text. If it is set to false, the text will
            // not be rendered. If it is set to true, the text will be shrinked.
            // This option is supported since echarts-wordcloud@2.1.0
            shrinkToFit: false,

            // If perform layout animation.
            // NOTE disable it will lead to UI blocking when there is lots of words.
            layoutAnimation: true,

            // Global text style
            textStyle: {
              fontFamily: "sans-serif",
              fontWeight: "bold",
              // Color can be a callback function or a color string
              color: function () {
                // Random color
                return (
                  "rgb(" +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                  ].join(",") +
                  ")"
                );
              },
            },
            emphasis: {
              focus: "self",
              textStyle: {
                textShadowBlur: 10,
                textShadowColor: "#333",
              },
            },

            // Data is an array. Each array item must have name and value property.
            data: this.data,
            //   name: "Farrah Abraham",
            //   value: 366,
            //   // Style of single text
            //   textStyle: {},
            // },
          },
        ],
      };
      myChart.setOption(this.option);
    },
  },
};
</script>
<style lang="less" scoped>
.WordCloud {
  > div {
    width: 200%;
    height: 200%;
    transform-origin: 0 0;
    transform: scale(0.5);
  }
}
</style>
