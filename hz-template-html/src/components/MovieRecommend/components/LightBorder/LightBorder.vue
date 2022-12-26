<template>
  <div :class="['light-border', reverse ? 'reverse' : 'default']" ref="border">
    <div class="point" :style="{ animationDuration: time }">
      <!-- 用于绘制边框的元素 -->
      <div class="one"></div>
      <div class="two"></div>
    </div>
    <div class="slot">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "LightBorder",
  data() {
    return {
      slot: null,
    };
  },
  props: {
    width: {
      type: Number,
      default: 4,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      default: "3s",
    },
  },
  mounted() {
    // 找到slot插槽
    let slot;
    for (let [key, value] of Object.entries(this.$refs.border.childNodes)) {
      if (value.className === "slot") {
        this.slot = value;
        continue;
      }
    }
    if (this.slot.childNodes.length !== 1 || !this.slot.childNodes.length) {
      console.error("容器内有且只能包含一个根节点");
    } else {
      // 获取插入元素最外层的 圆角和宽高,赋值给continer
      let slotStyle = window.getComputedStyle(this.slot.childNodes[0], null);
      console.dir(this.slot);
      this.slot.style.borderRadius = slotStyle.borderRadius;
      let continer = this.$refs.border;
      continer.style.width = this.slot.clientWidth + this.$props.width + "px";
      continer.style.height = this.slot.clientHeight + this.$props.width + "px";
      continer.style.borderRadius = slotStyle.borderRadius;
    }
  },
};
</script>
<style lang="less" scoped>
@keyframes lightBorder {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.reverse {
  > .point {
    animation-direction: reverse;
    .one {
      right: 50%;
    }
    .two {
      left: 50%;
    }
  }
}
.default {
  > .point {
    .one {
      left: 50%;
    }
    .two {
      right: 50%;
    }
  }
}
.light-border {
  position: relative;
  overflow: hidden;
  > .point {
    z-index: 1;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: center center;
    animation-name: lightBorder;
    // animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    .one,
    .two {
      width: 100%;
      height: 50%;
      position: absolute;
    }
    .one {
      top: 0;
      background-image: linear-gradient(
        0deg,
        aqua 0% 10%,
        transparent 90% 100%
      );
    }
    .two {
      bottom: 0;
      background-image: linear-gradient(
        180deg,
        red 0% 10%,
        transparent 90% 100%
      );
    }
  }
  > .slot {
    // opacity: 0;
    background-color: black;
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
