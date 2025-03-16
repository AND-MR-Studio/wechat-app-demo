// answer.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 汤题标题
    soupTitle: "最后是自己",
    // 汤底内容
    answerContent: "这是描述一个食人族部落的成长仪式。在这个部落里，孩子成长的过程中会经历几个阶段：\n1. 一开始，他们会猎杀并食用动物\n2. 然后，他们会食用已经死亡的同类（部落中的尸体）\n3. 接着，他们会猎杀并食用其他活着的同类（其他部落的人）\n4. 最后，在最终的成人仪式中，他们会吃掉自己身体的一部分。",
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
      source: 'url("https://yavin-miniprogram-1322698236.cos.ap-guangzhou.myqcloud.com/HuiWenMingChao.ttf")',
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