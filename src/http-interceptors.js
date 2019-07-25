import axios from "axios";
import store from "./store";

axios.interceptors.request.use(config => {
  if (store.state.token) {
    config.headers.token = store.state.token;
  }
  return config;
});

axios.interceptors.response.use(
  response => {
    if (response.status == 200) {
      const data = response.data;
      if (data.code == -2) {
        clearHandler();
      }
    }
    return response;
  },
  err => {
    if (err.response.status == 401) {
      clearHandler();
    }
  }
);

function clearHandler() {
  // 清空缓存
  store.commit("setToken", "");
  localStorage.clear();
}
