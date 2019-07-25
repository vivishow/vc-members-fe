<template>
  <div id="app">
    <van-nav-bar
      :title="g_name"
      :left-arrow="back"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <van-icon name="more-o" slot="right"></van-icon>
    </van-nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <router-view ref="child" />
    </van-pull-refresh>

    <!-- 登录窗口 -->
    <van-popup v-model="showLogin" :close-on-click-overlay="false" :style="{width: '80%'}" round>
      <van-cell-group title="请登录">
        <van-field clearable v-model="userName" label="用户名" placeholder="请输入用户名" />
        <van-field clearable v-model="password" label="密码" type="password" />
        <van-button type="primary" @click="login">登录</van-button>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      showLogin: true,
      isLoading: false,
      userName: "",
      password: ""
    };
  },
  computed: {
    back() {
      return this.$route.name != "home";
    },
    ...mapState(["g_name", "token"])
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    onClickRight() {
      this.$refs.child.more();
    },
    async onRefresh() {
      await this.$refs.child.refresh();
      this.isLoading = false;
    },
    async login() {
      this.$toast.loading({
        duration: 0,
        mask: true,
        forbidClick: true,
        message: "正在处理，请稍后……"
      });
      const { code, message } = await this.$store.dispatch("login", {
        u_name: this.userName,
        pwd: this.password
      });
      if (code === 1) {
        this.$toast.success(message);
        this.showLogin = false;
      } else {
        this.$toast.fail(message);
      }
    }
  },
  created() {
    if (this.token) {
      this.showLogin = false;
    }
  }
};
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: whitesmoke;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.header {
  position: relative;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: whitesmoke;

  .van-icon-arrow-left {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 15px;
    color: #fc915b;
  }
}

.van-pull-refresh {
  height: auto;
}
</style>
