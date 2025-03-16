// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 加载全局自定义字体
    this.loadGlobalFont();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  // 加载全局字体
  loadGlobalFont() {
    wx.loadFontFace({
      family: 'HuiWenMingTi',
      source: 'url("https://yavin-miniprogram-1322698236.cos.ap-guangzhou.myqcloud.com/HuiWenMingChao.ttf")',
      global: true,
      success: function(res) {
        console.log('全局字体加载成功', res);
      },
      fail: function(err) {
        console.log('全局字体加载失败', err);
      },
      complete: function(res) {
        console.log('全局字体加载完成', res);
      }
    });
  },

  globalData: {
    userInfo: null
  }
})
