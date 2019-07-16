<template>
  <div id="app">
    <van-nav-bar
      :title="title"
      :left-arrow="back"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <van-icon name="more-o" slot="right"></van-icon>
    </van-nav-bar>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <router-view ref="child" />
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "vc-members",
      isLoading: false
    };
  },
  computed: {
    back() {
      return this.$route.name != "home";
    }
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
