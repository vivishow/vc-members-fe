module.exports = {
  devServer: {
    // 设置开发环境跨域配置
    proxy: {
      "/api": {
        target: "https://vc-members.herokuapp.com/api", // 跨域地址
        changeOrigin: true, // 是否跨域（必须为true）
        pathRewrite: {
          // 重写URL
          "^/api": ""
        }
      }
    }
  }
};
