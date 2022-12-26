<template>
  <div class="virtual-scroller w100 h100 fx-col-st">
    <div class="title" :style="{ color: titleColor }">{{ title }}</div>
    <div
      ref="scrollBox"
      :class="{ hiddenScroll: !showScroll }"
      class="w100 h100"
      id="virtual-scroller"
      :style="{ backgroundColor: bgColor, borderRadius: radius + 'px' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "VirtualScroller",
  data() {
    return {
      VirtualScroller: null,
      scrollBox: null,
      timer: null,
    };
  },
  props: {
    titleColor: {
      // 标题颜色
      type: String,
      default: "#00fff7",
    },
    title: {
      // 标题
      type: String,
      require: true,
    },
    interval: {
      // 滚动间隔时长
      type: Number,
      default: 0,
    },
    itemHeight: {
      // 元素高度,(px)
      type: Number,
      default: 60,
    },
    data: {
      type: Array,
      require: true,
    },
    showScroll: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: "transparent",
    },
    color: {
      type: String,
      default: "#000",
    },
    fontWeight: {
      type: Number,
      default: 400,
    },
    fontSize: {
      type: String,
      default: "18px",
    },
    radius: {
      type: Number,
      default: 0,
    },
  },
  created() {
    function throttle(fn, wait) {
      let lastTime = 0;
      let timer;
      return function (...args) {
        function run() {
          const now = new Date().valueOf();
          if (now - lastTime > wait) {
            fn.apply(this, args);
            lastTime = now;
          }
        }
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(run, wait);
        run();
      };
    }
    this.VirtualScroller = class VirtualScroller {
      constructor({
        element,
        height,
        rowHeight,
        pageSize,
        buffer,
        renderItem,
        loadMore,
        color,
        fontWeight,
        fontSize,
      }) {
        if (typeof element === "string") {
          this.scroller = document.querySelector(element);
        } else if (element instanceof HTMLElement) {
          this.scroller = element;
        }

        if (!this.scroller) {
          throw new Error("Invalid element");
        }

        if (
          !height ||
          (typeof height !== "number" && typeof height !== "string")
        ) {
          throw new Error("invalid height value");
        }

        if (!rowHeight || typeof rowHeight !== "number") {
          throw new Error("rowHeight should be a number");
        }

        if (typeof renderItem !== "function") {
          throw new Error("renderItem is not a function");
        }

        if (typeof loadMore !== "function") {
          throw new Error("renderItem is not a function");
        }

        // set props
        this.fontWeight = fontWeight;
        this.fontSize = fontSize;
        this.color = color;
        this.height = height;
        this.rowHeight = rowHeight;
        this.pageSize =
          typeof pageSize === "number" && pageSize > 0 ? pageSize : 50;
        this.buffer = typeof buffer === "number" && buffer >= 0 ? buffer : 10;
        this.renderItem = renderItem;
        this.loadMore = loadMore;
        this.data = [];

        // create content box
        let contentBox = document.createElement("div");
        contentBox.className = "container";
        this.contentBox = contentBox;
        this.scroller.append(contentBox);
        this.scroller.style.height =
          typeof height === "number" ? height + "px" : height;

        this.loadInitData();
        this.scroller.addEventListener(
          "scroll",
          throttle(this.handleScroll, 150)
        );
      }

      topHiddenCount = 0;
      bottomHiddenCount = 0;
      scrollTop = 0;
      paddingTop = 0;
      paddingBottom = 0;
      lastVisibleItemIndex = 0;

      loadInitData() {
        const scrollerRect = this.scroller.getBoundingClientRect();
        const minCount = Math.ceil(scrollerRect.height / this.rowHeight);
        const page = Math.ceil(minCount / this.pageSize);
        const newData = this.loadMore(page * this.pageSize).map(
          (item, index) => {
            return { item: item, id: this.data.length + index };
          }
        );
        this.data.push(...newData);
        this.renderNewData(newData);
        if (this.data.length * this.rowHeight < this.scroller.scrollHeight) {
          this.loadInitData();
        }
      }

      renderRow(item) {
        const rowContent = this.renderItem(item);
        const row = document.createElement("div");
        row.dataset.index = item.item.id;
        row.classList.add("item", item.id % 2 ? "odd" : "even");
        row.style.height = this.rowHeight + "px";
        row.style.color = this.color;
        row.style.fontSize = this.fontSize;
        row.style.fontWeight = this.fontWeight;
        row.style.userSelect = "none";
        row.appendChild(rowContent);
        return row;
      }

      renderNewData(newData) {
        newData.forEach((item) => {
          this.contentBox.append(this.renderRow(item));
        });
      }

      handleScroll = (e) => {
        if (e.target) {
          const { clientHeight, scrollHeight, scrollTop } = e.target;
          if (scrollHeight - (clientHeight + scrollTop) < 40) {
            // console.log("load more");
            const newData = this.loadMore(this.pageSize).map((item, index) => {
              return { item: item, id: this.data.length + index };
            });
            this.data.push(...newData);
          }
          const direction = scrollTop > this.scrollTop ? 1 : -1;
          this.toggleTopItems(direction);
          this.toggleBottomItems(direction);
          this.scrollTop = scrollTop;
          // console.log({
          //   direction,
          //   topHiddenCount: this.topHiddenCount,
          //   lastVisibleItemIndex: this.lastVisibleItemIndex,
          // });
        }
      };

      toggleTopItems = (direction) => {
        const { scrollTop } = this.scroller;
        const firstVisibleItemIndex = Math.floor(scrollTop / this.rowHeight);
        const firstExistingItemIndex = Math.max(
          0,
          firstVisibleItemIndex - this.buffer
        );
        const rows = this.contentBox.children;
        // replace invisible top items with padding top
        if (direction === 1) {
          for (let i = this.topHiddenCount; i < firstExistingItemIndex; i++) {
            if (rows[0]) rows[0].remove();
          }
        }
        // restore hidden top items
        if (direction === -1) {
          for (
            let i = this.topHiddenCount - 1;
            i >= firstExistingItemIndex;
            i--
          ) {
            const item = this.data[i];
            const row = this.renderRow(item);
            this.contentBox.prepend(row);
          }
        }
        this.topHiddenCount = firstExistingItemIndex;
        this.paddingTop = this.topHiddenCount * this.rowHeight;
        this.contentBox.style.paddingTop = this.paddingTop + "px";
      };

      toggleBottomItems = (direction) => {
        const { scrollTop, clientHeight } = this.scroller;
        const lastVisibleItemIndex = Math.floor(
          (scrollTop + clientHeight) / this.rowHeight
        );
        const lastExistingItemIndex = lastVisibleItemIndex + this.buffer;
        this.lastVisibleItemIndex = lastVisibleItemIndex;
        const rows = [...this.contentBox.children];
        // replace invisible bottom items with padding bottom
        if (direction === -1) {
          for (let i = lastExistingItemIndex + 1; i <= this.data.length; i++) {
            const row = rows[i - this.topHiddenCount];
            if (row) row.remove();
          }
        }
        // restore hidden bottom items
        if (direction === 1) {
          for (
            let i = this.topHiddenCount + rows.length;
            i <= lastExistingItemIndex;
            i++
          ) {
            const item = this.data[i];
            if (!item) break;
            const row = this.renderRow(item);
            this.contentBox.append(row);
          }
        }
        this.bottomHiddenCount = Math.max(
          0,
          this.data.length -
            (this.topHiddenCount + this.contentBox.children.length) -
            this.buffer
        );
        this.paddingBottom = this.bottomHiddenCount * this.rowHeight;
        this.contentBox.style.paddingBottom = this.paddingBottom + "px";
      };
    };
  },
  mounted() {
    const that = this;
    function fetchData(pageSize) {
      // console.log(pageSize);
      for (let i = 0; i < pageSize; i++) {
        const dataItem = dummyText.substring(
          0,
          Math.round(20 + Math.random() * dummyText.length) * 0.3
        );
        const length = data.push(dataItem);
        renderItem(dataItem, length - 1);
      }
    }
    new this.VirtualScroller({
      element: "#virtual-scroller",
      height: "100%",
      rowHeight: this.itemHeight, // px
      pageSize: 30,
      buffer: 10,
      color: this.$props.color,
      fontWeight: this.$props.fontWeight,
      fontSize: this.$props.fontSize,
      renderItem: function (dataItem) {
        const div = document.createElement("div");
        div.classList.add("row-content");
        div.dataset.index = dataItem.item.id;
        div.textContent = dataItem.item.value;
        return div;
      },
      // 加载更多的方法,返回数组,
      loadMore: function (pageSize) {
        return that.$props.data;
      },
    });
    this.scrollBox = this.$refs.scrollBox;
    // console.dir(this.scrollBox);
    // 自动滚动配置
    if (this.$props.interval) {
      this.timer = setInterval(() => {
        this.scrollBox.scrollTop += this.itemHeight / this.itemHeight;
      }, this.interval / this.itemHeight);
      this.scrollBox.onmouseover = () => {
        clearInterval(this.timer);
      };
      this.scrollBox.onmouseleave = () => {
        this.timer = setInterval(() => {
          this.scrollBox.scrollTop += this.itemHeight / this.itemHeight;
        }, this.interval / this.itemHeight);
      };
    }
    // 点击事件
    this.scrollBox.onclick = (e) => {
      e.target.dataset.index
        ? this.$emit("click", { id: e.target.dataset.index })
        : "";
    };
  },
};
</script>

<style lang="less" scoped>
.virtual-scroller {
  > .title {
    padding-left: 15px;
    padding-bottom: 10px;
    font-weight: 600;
    font-size: 18px;
  }
  :deep(#virtual-scroller) {
    background-color: #f0f2f7;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      background-color: transparent;
      width: 10px !important;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--col-main);
    }
    .container {
      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        .row-content {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  .hiddenScroll {
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
