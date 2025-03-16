// login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户名
    username: '',
    // 密码
    password: '',
    // 是否正在登录中
    isLoggingIn: false,
    // 登录出错信息
    errorMsg: '',
    // 状态栏高度
    statusBarHeight: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('登录页面加载');
    
    // 获取系统信息设置状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 20
    });
    
    // 检查是否已登录
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus: function() {
    // 从本地存储中获取登录信息
    const userInfo = wx.getStorageSync('userInfo');
    
    if (userInfo) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/home/home'
      });
    }
  },

  /**
   * 输入用户名
   */
  onInputUsername: function(e) {
    this.setData({
      username: e.detail.value,
      errorMsg: ''
    });
  },

  /**
   * 输入密码
   */
  onInputPassword: function(e) {
    this.setData({
      password: e.detail.value,
      errorMsg: ''
    });
  },

  /**
   * 点击登录按钮
   */
  onLoginTap: function() {
    // 验证输入
    if (!this.data.username) {
      this.setData({
        errorMsg: '请输入用户名'
      });
      return;
    }
    
    if (!this.data.password) {
      this.setData({
        errorMsg: '请输入密码'
      });
      return;
    }
    
    // 设置登录中状态
    this.setData({
      isLoggingIn: true,
      errorMsg: ''
    });
    
    // 模拟登录请求
    setTimeout(() => {
      // 假设登录成功
      const userInfo = {
        username: this.data.username,
        nickname: '汤友' + Math.floor(Math.random() * 10000),
        avatar: '/images/default-avatar.png',
        loginTime: new Date().getTime()
      };
      
      // 保存用户信息到本地存储
      wx.setStorageSync('userInfo', userInfo);
      
      // 登录成功跳转到首页
      wx.reLaunch({
        url: '/pages/home/home',
        success: () => {
          console.log('登录成功，跳转到首页');
        }
      });
      
      // 重置登录状态
      this.setData({
        isLoggingIn: false
      });
    }, 1500);
  },

  /**
   * 跳转到注册页面
   */
  onRegisterTap: function() {
    wx.showToast({
      title: '暂未开放注册',
      icon: 'none'
    });
  },

  /**
   * 跳转到忘记密码页面
   */
  onForgetPasswordTap: function() {
    wx.showToast({
      title: '暂未开放此功能',
      icon: 'none'
    });
  },

  /**
   * 返回首页
   */
  onHomeClick: function() {
    wx.reLaunch({
      url: '/pages/home/home'
    });
  }
}) 