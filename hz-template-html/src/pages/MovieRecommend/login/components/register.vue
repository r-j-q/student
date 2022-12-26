<template>
  <div class="login">
    <header>注册</header>
    <main>
      <div class="item">
        <div class="inp">
          <div class="label">
            <i class="iconfont icon-user"></i>
          </div>
          <el-input
            ref="username"
            @focus="focus('username')"
            placeholder="请输入用户名"
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
            autocomplete="off"
            @focus="focus('password')"
            ref="password"
            type="password"
            placeholder="请输入密码"
            v-model="from.password"
          ></el-input>
          <i
            @click="rewrite('password')"
            v-if="error.password.length"
            class="iconfont icon-err col-red"
          ></i>
        </div>
        <div class="msg">
          {{ error.password }}
        </div>
      </div>
      <div class="item">
        <div class="inp">
          <div class="label">
            <i class="iconfont icon-pwd"></i>
          </div>
          <el-input
            autocomplete="off"
            @focus="focus('password_')"
            ref="password_"
            type="password"
            placeholder="请再次输入密码"
            v-model="from.password_"
          ></el-input>
          <i
            @click="rewrite('password_')"
            v-if="error.password_.length"
            class="iconfont icon-err"
          ></i>
        </div>
        <div class="msg">
          {{ error.password_ }}
        </div>
      </div>
      <div class="item">
        <div class="inp">
          <div class="label">
            <i class="iconfont icon-phone"></i>
          </div>
          <el-input
            autocomplete="off"
            @focus="focus('phone')"
            ref="phone"
            placeholder="请输入手机号"
            v-model="from.phone"
          ></el-input>
          <i
            @click="rewrite('phone')"
            v-if="error.phone.length"
            class="iconfont icon-err"
          ></i>
        </div>
        <div class="msg w100 f12 col-red">
          {{ error.phone }}
        </div>
      </div>
      <div class="item">
        <div class="inp">
          <div class="label">
            <i class="iconfont icon-school"></i>
          </div>
          <el-input
            autocomplete="off"
            @focus="focus('school')"
            ref="school"
            placeholder="请输入就读院校"
            v-model="from.school"
          ></el-input>
          <i
            @click="rewrite('school')"
            v-if="error.school.length"
            class="iconfont icon-err"
          ></i>
        </div>
        <div class="msg">
          {{ error.school }}
        </div>
      </div>
      <div class="item">
        <div class="inp">
          <div class="label">
            <i class="iconfont icon-name"></i>
          </div>
          <el-input
            autocomplete="off"
            @focus="focus('name')"
            ref="name"
            placeholder="请输入真实姓名"
            v-model="from.name"
          ></el-input>
          <i
            @click="rewrite('name')"
            v-if="error.name.length"
            class="iconfont icon-err"
          ></i>
        </div>
        <div class="msg">
          {{ error.name }}
        </div>
      </div>
      <div class="item">
        <div class="inp">
          <div class="label">性别</div>
          <el-radio v-model="from.gender" :label="1">男</el-radio>
          <el-radio v-model="from.gender" :label="0">女</el-radio>
        </div>
      </div>
    </main>
    <div class="btn" @click="login">
      <a href="#">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Register
      </a>
    </div>
    <footer>
      <div class="btn" @click="goRegister">to Login</div>
    </footer>
  </div>
</template>

<script>
import { authRegister } from "@/api/MovieRecommend/login";
import { getToken, setToken, removeToken } from "@/utils/auth.js";
export default {
  data() {
    return {
      from: {
        username: "", // 用户名
        password: "", // 密码
        password_: "", // 再次输入密码
        phone: "", // 手机号
        school: "", // 就读院校
        area: "", // 所在地区地址
        gender: 0, // 性别
        name: "", // 姓名
        // nickname
        // desc
      },
      error: {
        username: "", // 错误信息,
        password: "",
        password_: "",
        phone: "",
        school: "",
        area: "",
        name: "",
      },
    };
  },
  methods: {
    login() {
      // 获取表单
      let data = {
        username: this.from.username.trim(),
        password: this.from.password.trim(),
        password_: this.from.password_.trim(),
        phone: this.from.phone.trim(),
        school: this.from.school.trim(),
        area: this.from.area.trim(),
        name: this.from.name.trim(),
        gender: this.from.gender,
      };
      // 判断是否为空
      for (let key in data) {
        let err = {
          username: "请输入用户名!",
          password: "请输入密码!",
          password_: "请再次输入密码!",
          phone: "请输入手机号!",
          school: "请输入就读院校!",
          area: "请输入地区地址!",
          name: "请输入姓名!",
        };
        if (["area", "gender"].indexOf(key) > -1) continue;
        if (!data[key].length) {
          console.log("err", key, data);
          this.error[key] = err[key];
          this.$message.error(err[key]);
          return;
        }
      }
      // 正则
      let reg = {
        phone: new RegExp(/^\d{11}$/g),
      };
      // 验证输入信息格式
      // 验证两次输入密码
      if (data.password !== data.password_) {
        this.error.password_ = "输入密码不一致";
        this.$message.error("输入密码不一致");
        return;
      }
      // 验证手机号
      if (!reg.phone.test(data.phone)) {
        this.error.phone = "手机号格式不正确";
        this.$message.error("手机号格式不正确");
        return;
      }
      data.nickname = data.username;
      authRegister(data).then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message({
              message: "注册成功,请登录!",
              type: "success",
            });
            this.$emit("chackType");
          } else if (res.data.code === 500) {
            this.$message.error(`注册失败, ${res.data.msg}`);
          }
        } else {
          this.$message.error(`注册失败,${res.data.msg}`);
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
    text-align: center;
    width: 100%;
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
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        position: relative;
        > .label {
          height: 100%;
          margin-right: 20px;
          > i {
            font-size: @inp-height;
            color: @label-color;
          }
          width: @inp-height;
          font-weight: 600;
          color: @label-color;
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
        width: 100%;
        font-size: 12px;
        color: red;
        line-height: 20px;
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
