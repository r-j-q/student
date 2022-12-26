<template>
  <div class="chart w100 h100 pos-rel bg-000">
    <div
      class="chart-container pos-rel pd-horizontal-20 over-hidden"
      ref="appRef"
    >
      <header class="w100 fx-center pos-rel">
        <div class="title f32 fw-600 font-family-1 dis-select col-main">
          电影推荐系统
        </div>
        <div class="time col-main fx-start-center dis-select">
          <div class="time col-main fw-600 f20 pd-r-20">{{ nowTime }}</div>
          <div class="date fx-col-center fw-400 f16">
            <div class="nowWeek">{{ nowWeek }}</div>
            <div class="nowDate">{{ nowDate }}</div>
          </div>
        </div>
      </header>
      <!-- 内容区域 -->
      <main class="w100 fx-sb pd-vertical-20">
        <!-- 采用宫格布局,利用 类名分配图表大小以及位置, 在下方style标签中配置 -->
        <!-- 类名最好与组件名一致, 方便管理 -->
        <div class="country-ratio">
          <dv-border-Box-1>
            <country-ratio></country-ratio>
          </dv-border-Box-1>
        </div>
        <div class="gread-statistics">
          <dv-border-Box-1>
            <gread-statistics></gread-statistics>
          </dv-border-Box-1>
        </div>
        <div class="movie-rank">
          <dv-border-Box-1>
            <movie-rank></movie-rank>
          </dv-border-Box-1>
        </div>
        <div class="word-cloud">
          <dv-border-Box-1>
            <word-cloud></word-cloud>
          </dv-border-Box-1>
        </div>
        <div class="china-movie">
          <dv-border-Box-1>
            <china-movie></china-movie>
          </dv-border-Box-1>
        </div>
      </main>
      <div class="header col-main">
        <el-image
          ondragstart="return false"
          oncontextmenu="return false"
          :src="header"
          fit="cover"
          class="img w100 dis-select"
        ></el-image>
      </div>
      <!-- 下面是地球动画 -->
      <!-- <div class="earth" style="">
        <el-image
          ondragstart="return false"
          oncontextmenu="return false"
          :src="earth"
          fit="cover"
          class="w100 h100 dis-select"
        ></el-image>
      </div>
      <div class="point" style="">
        <el-image
          ondragstart="return false"
          oncontextmenu="return false"
          :src="point"
          fit="cover"
          class="w100 h100 dis-select"
        ></el-image>
      </div>
      <div class="net" style="">
        <el-image
          ondragstart="return false"
          oncontextmenu="return false"
          :src="net"
          fit="cover"
          class="w100 h100 dis-select"
        ></el-image>
      </div> -->
      <div class="bg w100 h100">
        <el-image :src="bg" class="w100" fit="cover"></el-image>
      </div>
      <div v-if="icon" class="sun">
        <el-image
          ondragstart="return false"
          oncontextmenu="return false"
          :src="icon"
          fit="cover"
          class="w100 h100 dis-select"
        ></el-image>
      </div>
    </div>
  </div>
</template>

<script>
// 引入图片
import earth from "@/pages/MovieRecommend/static/imgs/earth.png";
import point from "@/pages/MovieRecommend/static/imgs/point.png";
import net from "@/pages/MovieRecommend/static/imgs/net.png";
import sun from "@/pages/MovieRecommend/static/imgs/sun.png";
import moon from "@/pages/MovieRecommend/static/imgs/moon.png";
import header from "@/pages/MovieRecommend/static/imgs/header.png";
import bg from "@/pages/MovieRecommend/static/imgs/bg.jpeg";
import drawMixin from "@/utils/drawMixin.js";
// 引入Echarts主题
import "@/common/echarts/transLight_6/transLight_6";
import "@/common/echarts/transLight_5/transLight_5";
// 引入组件
import CountryRatio from "@/components/MovieRecommend/charts/CountryRatio/CountryRatio.vue";
import GreadStatistics from "@/components/MovieRecommend/charts/GreadStatistics/GreadStatistics.vue";
import MovieRank from "@/components/MovieRecommend/charts/MovieRank/MovieRank.vue";
import WordCloud from "@/components/MovieRecommend/charts/WordCloud/WordCloud.vue";
import ChinaMovie from "@/components/MovieRecommend/charts/ChinaMovie/ChinaMovie.vue";
export default {
  mixins: [drawMixin],
  components: {
    CountryRatio,
    GreadStatistics,
    MovieRank,
    WordCloud,
    ChinaMovie,
  },
  data() {
    return {
      // >>>>>>>>>>>>>>>
      bg,
      header,
      net,
      point,
      earth,
      icon: null,
      timer: null, // 定时器
      nowTime: "", // 现在的时间
      nowWeek: "", // 星期几
      nowDate: "", // 现在的日期
      dur: 3, // 边框动画单次时长
      gender: null, // 男女分布
      status: null,
    };
  },
  mounted() {
    // 获取当前时间
    this.timer = setInterval(() => {
      const weekArr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let moment = this.moment();
      this.nowTime = moment.format("HH:mm:ss");
      this.nowDate = moment.format("YYYY-MM-DD");
      this.nowWeek = weekArr[moment.format("d")];
      let hour = Number(moment.format("H"));
      this.icon = hour > 7 && hour < 18 ? sun : moon;
    }, 1000);
    this.getData();
  },
  methods: {
    getData() {},
  },
};
</script>
<style lang="less" scope>
main {
  // 在浏览器中打开调试,点击左上角检查元素, 将光标移动到大屏上, 能看到空格布局的具体分布
  // 宫格布局中,相邻单元格之间的线称之为网格线, 例如当前布局横向共12个单元格,就有13条网格线,命名规则从左往右,1-13,依次递增,
  // .all-table {
  //   grid-column: 6/13; 横向从第6条网格线到第13条网格线之间的部分
  //   grid-row: 1/9; 纵向从第一条网格线到第九条网格线之间的部分
  // }
  .country-ratio {
    grid-column: 1/5;
    grid-row: 1/6;
  }
  .gread-statistics {
    grid-column: 9/13;
    grid-row: 1/6;
  }
  .movie-rank {
    grid-column: 6/13;
    grid-row: 6/13;
  }
  .word-cloud {
    grid-column: 1/6;
    grid-row: 6/13;
  }
  .china-movie {
    grid-column: 5/9;
    grid-row: 1/6;
  }
}
@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
  }

  100% {
    transform: rotateZ(360deg);
  }
}
@keyframes shake {
  0% {
    transform: skewX(-15deg);
  }
  5% {
    transform: skewX(15deg);
  }
  10% {
    transform: skewX(-15deg);
  }
  15% {
    transform: skewX(15deg);
  }
  20% {
    transform: skewX(0deg);
  }
  100% {
    transform: skewX(0deg);
  }
}
.chart {
  > .chart-container {
    background-size: cover;
    > .bg {
      position: absolute;
      top: 0;
      left: 0;
      filter: contrast(100%) brightness(20%);
    }
    > .header {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      > .img {
        filter: brightness(150%) grayscale(0%) hue-rotate(-5deg);
      }
    }
    > .earth,
    .point,
    .net {
      filter: grayscale(50%) opacity(20%);
    }
    > .earth {
      width: 650px;
      height: 650px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 330px;
      z-index: 2;
    }
    > .point,
    .net {
      width: 710px;
      position: absolute;
      top: 300px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;

      img {
        transform-origin: center;
        animation-name: rotate;
        animation-duration: 20s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    }
    > .point img {
      animation-direction: reverse;
    }
    > .sun {
      width: 35px;
      height: 35px;
      position: absolute;
      left: 50px;
      top: 15px;
      z-index: 2;
    }
    > header {
      z-index: 2;
      height: 100px;
      > .title {
        position: relative;
        text-transform: uppercase;
        letter-spacing: 6px;
        font-size: 50px;
        font-weight: 900;
        text-decoration: none;
        color: white;
        display: inline-block;
        background-size: 120% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-background-clip: text;
        -moz-text-fill-color: transparent;
        -ms-background-clip: text;
        -ms-text-fill-color: transparent;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        background-image: linear-gradient(
          45deg,
          #ff1361,
          #fff800,
          #7794ff,
          #44107a
        );
        animation: 0.8s shake infinite alternate;
      }
      > .time {
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        right: 30px;
      }
    }
    > main {
      height: 987px;
      width: 1880px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      display: grid;
      grid-template-columns: repeat(12, 138px);
      grid-template-rows: repeat(12, 60px);
      justify-content: space-between;
      align-content: space-between;
      // 所有盒子配置边角
      > .point {
        background: linear-gradient(to top, #3cc5e4, #3cc5e4) left top no-repeat,
          /*上左*/ linear-gradient(to right, #3cc5e4, #3cc5e4) left top
            no-repeat,
          /*左上*/ linear-gradient(to left, #3cc5e4, #3cc5e4) right top
            no-repeat,
          /*上右*/ linear-gradient(to bottom, #3cc5e4, #3cc5e4) right top
            no-repeat,
          /*上右*/ linear-gradient(to left, #3cc5e4, #3cc5e4) left bottom
            no-repeat,
          /*下左*/ linear-gradient(to bottom, #3cc5e4, #3cc5e4) left bottom
            no-repeat,
          /*左下*/ linear-gradient(to top, #3cc5e4, #3cc5e4) right bottom
            no-repeat,
          /*下右*/ linear-gradient(to left, #3cc5e4, #3cc5e4) right bottom
            no-repeat;
        /*右下*/
        background-size: 2px 16px, 16px 2px, 2px 16px, 16px 2px;
        background-color: rgba(197, 228, 255, 0.1);
      }
    }
  }
}
</style>
