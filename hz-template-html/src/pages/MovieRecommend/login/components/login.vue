<template>
  <div class="login">
    <header>登录</header>
    <main>
      <div class="item">
        <div class="inp">
          <div class="label">
            <i class="iconfont icon-user"></i>
          </div>
          <el-input
            ref="username"
            autocomplete="off"
            @focus="focus('username')"
            placeholder="Please enter your UserName"
            v-model="from.username"
          ></el-input>
          <i
            @click="rewrite('username')"
            v-if="error.username.length"
            class="iconfont icon-err"
          ></i>
        </div>
        <div class="msg">
          {{ error.username }}
        </div>
      </div>
      <div class="item">
        <div class="inp">
          <div class="label">
            <i class="iconfont icon-pwd"></i>
          </div>
          <el-input
            @focus="focus('password')"
            ref="password"
            type="password"
            autocomplete="off"
            placeholder="Please enter your PassWord"
            v-model="from.password"
          ></el-input>
          <i
            @click="rewrite('password')"
            v-if="error.password.length"
            class="iconfont icon-err"
          ></i>
        </div>
        <div class="msg w100 f12">
          {{ error.password }}
        </div>
      </div>
    </main>
    <div class="btn" @click="login">
      <a href="#">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Login
      </a>
    </div>
    <footer>
      <div class="btn" @click="goRegister">Go to register</div>
    </footer>
  </div>
</template>

<script>
import { authLogin } from "@/api/MovieRecommend/login";
import { getToken, setToken, removeToken } from "@/utils/auth.js";
export default {
  data() {
    return {
      from: {
        username: "",
        password: "",
      },
      error: {
        username: "", // 错误信息,
        password: "",
      },
    };
  },
  methods: {
    login() {
      // 获取表单
      let data = {
        username: this.from.username.trim(),
        password: this.from.password.trim(),
      };
      // 判断是否为空
      for (let key in data) {
        let err = {
          username: "请输入用户名!",
          password: "请输入密码!",
        };
        if (!data[key].length) {
          this.error[key] = err[key];
          return;
        }
      }
      authLogin(data).then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message({
              message: "登录成功",
              type: "success",
            });
            sessionStorage.setItem("username", data.username);
            sessionStorage.setItem("password", data.password);
            setToken(res.data.data);
            // 跳转到大屏页面
            this.$router.replace({
              path: "/chart",
            });
          }
        } else {
          this.$message.error("用户名或密码错误,登录失败!");
        }
      });
    },
    focus(type) {
      // 输入框获取焦点时, 如果已存在错误, 清空
      if (this.error[type].length) {
        this.error[type] = "";
        this.from[type] = "";
      }
    },
    goRegister() {
      this.$emit("chackType");
    },
    rewrite(type) {
      // 点击输入框 叉号 清除错误
      this.error[type] = "";
      this.from[type] = "";
      this.$refs[type].focus();
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./less/index.less");
.login {
  width: 500px;
  background-color: @bg-col;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
  > header {
    color: @label-color;
    width: 100%;
    text-align: center;
    font-weight: 600;
    font-size: 40px;
    padding-bottom: 20px;
  }
  > main {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    > .item {
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      padding-bottom: 20px;
      > .inp {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        > .label {
          height: 100%;
          margin-right: 20px;
          > i {
            font-size: @inp-height;
            color: @label-color;
          }
          width: @inp-height;
        }
        > .iconfont {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 20px;
          font-size: 20px;
          color: red;
        }
      }
      ::v-deep .el-input {
        .el-input__inner {
          background-color: @input-bg;
          color: @input-text;
          border: 2px solid @input-border;
          font-weight: 600;
        }
        .el-input__inner:focus {
          border: 2px solid @input-border-focus;
        }
        .el-input__inner::placeholder {
          color: @placeholder;
          font-weight: 400;
        }
      }
      > .msg {
        padding-left: calc(@inp-height + 20px);
        height: 20px;
        line-height: 20px;
        width: 100%;
        font-size: 12px;
        color: red;
      }
    }
  }
  > .btn {
    @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap");
    @keyframes animate1 {
      0% {
        left: -100%;
      }
      50%,
      100% {
        left: 100%;
      }
    }
    @keyframes animate2 {
      0% {
        top: -100%;
      }
      50%,
      100% {
        top: 100%;
      }
    }
    @keyframes animate3 {
      0% {
        right: -100%;
      }
      50%,
      100% {
        right: 100%;
      }
    }
    @keyframes animate4 {
      0% {
        bottom: -100%;
      }
      50%,
      100% {
        bottom: 100%;
      }
    }
    a:hover {
      background: #03e9f4;
      color: #050801;
      box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
        0 0 200px #03e9f4;
      -webkit-box-reflect: below 1px linear-gradient(transparent, #0005);
    }
    a {
      filter: hue-rotate(@btn-rotate); // 270; 110
      font-size: 20px;
      font-family: "Raleway", sans-serif;
      font-weight: bolder;
      position: relative;
      display: inline-block;
      padding: 15px 20px;
      color: #03e9f4;
      text-decoration: none;
      // text-transform: uppercase;
      transition: 0.5s;
      letter-spacing: 4px;
      overflow: hidden;
      span {
        position: absolute;
        display: block;
      }
      span:nth-child(1) {
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #03e9f4);
        animation: animate1 1s linear infinite;
      }
      span:nth-child(2) {
        top: -100%;
        right: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(180deg, transparent, #03e9f4);
        animation: animate2 1s linear infinite;
        animation-delay: 0.25s;
      }
      span:nth-child(3) {
        bottom: 0;
        right: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(270deg, transparent, #03e9f4);
        animation: animate3 1s linear infinite;
        animation-delay: 0.5s;
      }
      span:nth-child(4) {
        bottom: -100%;
        left: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(360deg, transparent, #03e9f4);
        animation: animate4 1s linear infinite;
        animation-delay: 0.75s;
      }
    }
  }
  > footer {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    > .btn {
      color: @btn-col;
      cursor: pointer;
      border-bottom: 1px solid transparent;
    }
    > .btn:hover {
      border-bottom: 1px solid @btn-col;
    }
  }
}
</style>
