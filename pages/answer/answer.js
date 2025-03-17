// answer.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 汤题标题
    soupTitle: "最后是自己",
    // 汤底内容
    answerContent: "少女为了复活爱人乞求邪神，\n邪神告诉她以五脏六腑为引的邪术，\n但没有告诉她要用自己的脏器。\n少女一个个尝试过来，\n最终用自己的性命换取爱人的性命。",
    // 状态栏高度
    statusBarHeight: 20,
    // 底部栏选中状态
    activeTab: 'drink'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('汤底页面加载');
    
    // 获取系统信息设置状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 20
    });
    
    // 如果有传递的汤题和答案，则更新数据
    if (options.title) {
      this.setData({
        soupTitle: options.title
      });
    }
    
    if (options.answer) {
      this.setData({
        answerContent: decodeURIComponent(options.answer)
      });
    }
    
    // 加载自定义字体
    this.loadCustomFont();
  },

  /**
   * 加载自定义字体
   */
  loadCustomFont: function() {
    console.log('开始加载字体');
    
    // 尝试加载自定义字体
    wx.loadFontFace({
      family: 'HuiWenMingTi',
      source: 'url("https://yavin-miniprogram-1322698236.cos.ap-chengdu.myqcloud.com/HuiWenMingChao.ttf")',
      success: (res) => {
        console.log('字体加载成功', res);
      },
      fail: (err) => {
        console.log('字体加载失败', err);
      },
      complete: (res) => {
        console.log('字体加载完成', res);
      }
    });
  },

  /**
   * 点击分享按钮
   */
  onShareTap: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 点击返回首页按钮
   */
  onHomeClick: function() {
    console.log('返回首页按钮被点击');
    
    // 返回首页
    wx.reLaunch({
      url: '/pages/home/home',
      success: function() {
        console.log('返回首页成功');
      },
      fail: function(error) {
        console.error('返回首页失败', error);
      }
    });
  },

  /**
   * 点击返回首页按钮
   */
  onBackToHomeTap: function() {
    this.onHomeClick();
  },

  /**
   * 处理更多按钮点击事件
   */
  onMoreClick: function() {
    console.log('更多按钮被点击');
    // 显示操作菜单
    wx.showActionSheet({
      itemList: ['分享汤面', '返回首页'],
      success: (res) => {
        console.log(res.tapIndex);
        // 根据点击的选项执行不同操作
        switch(res.tapIndex) {
          case 0: // 分享汤面
            this.onShareAppMessage();
            break;
          case 1: // 返回首页
            this.onBackToHomeTap();
            break;
        }
      }
    });
  },

  /**
   * 点击煲汤按钮
   */
  onCookSoupTap: function() {
    this.setData({
      activeTab: 'cook'
    });
    
    wx.showToast({
      title: '煲汤功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 点击我的按钮
   */
  onMyTap: function() {
    this.setData({
      activeTab: 'my'
    });
    
    wx.showToast({
      title: '个人中心开发中',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 点击喝汤按钮
   */
  onDrinkSoupTap: function() {
    this.setData({
      activeTab: 'drink'
    });
    
    // 返回对话页面
    wx.navigateBack({
      delta: 1,
      success: function() {
        console.log('返回对话页面成功');
      },
      fail: function(error) {
        console.error('返回对话页面失败', error);
        // 如果返回失败，尝试重新打开对话页面
        wx.navigateTo({
          url: '/pages/main/main'
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `你能猜到吗：${this.data.soupTitle}`,
      path: `/pages/answer/answer?title=${encodeURIComponent(this.data.soupTitle)}&answer=${encodeURIComponent(this.data.answerContent)}`,
      imageUrl: '/images/share-image.png' // 可以替换为实际的分享图片
    }
  }
}) 