// login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 每日海龟汤数据
    dailySoup: {
      title: '最后是自己',
      content: '一开始是动物，然后是同类的尸体，接着是同类，最后是自己。'
    },
    // 按钮动画状态
    buttonAnimating: false,
    // 背景动画状态
    backgroundAnimating: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 这里可以添加获取每日海龟汤数据的逻辑
    // 例如从服务器获取每日更新的海龟汤内容
    
    // 加载自定义字体
    this.loadCustomFont();
    
    // 初始化按钮和背景动画
    const buttonAnimation = wx.createAnimation({
      duration: 0
    });
    
    const backgroundAnimation = wx.createAnimation({
      duration: 0
    });
    
    // 设置初始样式
    buttonAnimation.scale(1).opacity(1).step();
    backgroundAnimation.opacity(1).step();
    
    // 应用动画
    this.setData({
      buttonAnimation: buttonAnimation.export(),
      backgroundAnimation: backgroundAnimation.export()
    });
  },

  /**
   * 加载自定义字体
   */
  loadCustomFont: function() {
    wx.loadFontFace({
      family: 'HuiWenMingTi',
      source: 'url("../../fonts/汇文明朝体.otf")',
      success: function(res) {
        console.log('字体加载成功', res);
      },
      fail: function(err) {
        console.log('字体加载失败', err);
      },
      complete: function(res) {
        console.log('字体加载完成', res);
      }
    });
  },

  /**
   * 点击开始按钮的事件处理函数
   */
  onStartTap: function () {
    // 如果按钮已经在动画中，则不处理
    if (this.data.buttonAnimating) {
      return;
    }
    
    // 设置按钮动画状态
    this.setData({
      buttonAnimating: true
    });
    
    // 创建按钮动画
    const buttonAnimation = wx.createAnimation({
      duration: 300,
      timingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
      delay: 0
    });
    
    // 创建背景动画
    const backgroundAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    
    // 按钮缩小并淡出
    buttonAnimation.scale(0.1).opacity(0).step();
    
    // 背景模糊并降低透明度
    backgroundAnimation.opacity(0.3).step();
    
    // 应用动画
    this.setData({
      buttonAnimation: buttonAnimation.export(),
      backgroundAnimation: backgroundAnimation.export(),
      backgroundAnimating: true
    });
    
    // 延迟跳转，等待动画完成
    setTimeout(() => {
      // 跳转到主对话页面
      wx.navigateTo({
        url: '/pages/main/main',
        success: () => {
          console.log('跳转到对话页面成功');
          
          // 重置动画状态
          setTimeout(() => {
            this.setData({
              buttonAnimating: false,
              backgroundAnimating: false
            });
          }, 100);
        },
        fail: (error) => {
          console.error('跳转失败', error);
          
          // 重置动画状态
          this.setData({
            buttonAnimating: false,
            backgroundAnimating: false
          });
        }
      });
    }, 300);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('登录页面显示');
    
    // 重置按钮和背景动画状态
    const buttonAnimation = wx.createAnimation({
      duration: 0
    });
    
    const backgroundAnimation = wx.createAnimation({
      duration: 0
    });
    
    // 重置按钮样式
    buttonAnimation.scale(1).opacity(1).step();
    
    // 重置背景样式
    backgroundAnimation.opacity(1).step();
    
    // 应用动画
    this.setData({
      buttonAnimation: buttonAnimation.export(),
      backgroundAnimation: backgroundAnimation.export(),
      buttonAnimating: false,
      backgroundAnimating: false
    });
  }
}) 