<template>
  <div class="execution">
    <basic-container>
      <el-scrollbar class="main">
        <iframe
          :src="src"
          class="iframe"/>
      </el-scrollbar>
    </basic-container>
  </div>
</template>

<script>
import store from "@/store/index.js";

export default {
  computed: {
    src: function () {
      const accessToken = store.getters.access_token
      return `/jimu/jmreport/list?token=${accessToken}`
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.iframe {
  width: 100%;
  height: 70vh; /*设置高度百分比,一直调到只有一个滚动调为止*/
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}

</style>
