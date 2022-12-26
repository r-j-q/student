// 屏幕适配 mixin 函数

// * 默认缩放值
const scale = {
  width: '1',
  height: '1',
}

// * 设计稿尺寸（px）
const baseWidth = 1920
const baseHeight = 1080

// * 需保持的比例（默认1.77778）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))

export default {
  data() {
    return {
      // * 定时函数
      drawTiming: null
    }
  },
  mounted() {
    this.calcRate()
    window.addEventListener('resize', this.resize)  //监听当前的浏览器窗口缩放
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize) //当销毁时移除当前监听对象
  },
  methods: {
    calcRate() {
      const appRef = this.$refs["appRef"]
      if (!appRef) return
      // 当前宽高比
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))  //float值
      console.log('当前窗口缩放比', currentRate)
      if (appRef) {  //当前dom实列组件对象存
        if (currentRate > baseProportion) {    //当前窗口比列缩放值大于初始比列
          // 表示更宽
          scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
          scale.height = (window.innerHeight / baseHeight).toFixed(5)
          appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`   //移动窗口居中
        } else {
          // 表示更高
          scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
          scale.width = (window.innerWidth / baseWidth).toFixed(5)
          appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        }
      }
    },
    resize() {
      clearTimeout(this.drawTiming)  //延时监听是因为要预留一点时间加载数据
      this.drawTiming = setTimeout(() => {
        // let start=new Date().getTime()
        // let end=new Date().getTime()
        // console.log(start,end,'开始，结束200ms监听')
        this.calcRate()
      }, 200)
    }
  },
}