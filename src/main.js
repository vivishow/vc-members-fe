import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueClipboard from "vue-clipboard2";
import "./vant-ui";

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
