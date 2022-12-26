<template>
  <div class="home_login">
    <login @chackType="chackType" v-if="login"></login>
    <register @chackType="chackType" v-else></register>
  </div>
</template>
<script>
import Login from "./components/login.vue";
import Register from "./components/register.vue";

import { getcsrfToken } from "@/api/MovieRecommend/login";
export default {
  components: {
    Login,
    Register,
  },
  data() {
    return {
      login: true,
    };
  },
  created() {
    getcsrfToken().then((res) => {
      localStorage.removeItem("X-CSRFToken");
      localStorage.setItem("X-CSRFToken", res.data.data);
    });
  },
  methods: {
    chackType() {
      this.login = !this.login;
    },
  },
};
</script>
<style lang="less" scoped>
.home_login {
  width: 100vw;
  height: 100vh;
  background: url("../static/imgs/bg.jpeg");
  background-size: cover;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
</style>
