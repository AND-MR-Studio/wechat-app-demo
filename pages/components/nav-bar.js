Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题文本
    title: {
      type: String,
      value: '一勺海龟汤'
    },
    // 是否是首页
    isHomePage: {
      type: Boolean,
      value: false
    },
    // 背景颜色（移除，使用透明背景）
    backgroundColor: {
      type: String,
      value: 'transparent'
    },
    // 文字颜色
    textColor: {
      type: String,
      value: '#ffffff'
    },
    // 下移距离
    topDistance: {
      type: Number,
      value: 35  
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 状态栏高度
    statusBarHeight: 20,
    // 导航栏高度
    navBarHeight: 44
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      // 获取系统信息设置状态栏高度
      const systemInfo = wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 20
      });
    },
    
    ready: function() {
      // 组件准备完成后，可以执行一些初始化操作
      console.log('导航栏组件准备完成，顶部距离：', this.data.topDistance);
    }
  },

  observers: {
    // 监听topDistance的变化
    'topDistance': function(newVal) {
      console.log('导航栏顶部距离已更新：', newVal);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击home按钮
    onHomeClick: function() {
      // 触发自定义事件
      this.triggerEvent('homeclick');
      
      // 根据是否在首页决定行为
      if (this.data.isHomePage) {
        // 如果是首页，执行刷新操作
        console.log('在首页点击home按钮，执行刷新操作');
        this.refreshCurrentPage();
      } else {
        // 如果不是首页，返回首页
        console.log('不在首页点击home按钮，返回首页');
        this.navigateToHome();
      }
    },
    
    // 刷新当前页面
    refreshCurrentPage: function() {
      // 获取当前页面路径
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentRoute = '/' + currentPage.route;
      
      // 重新加载当前页面
      wx.redirectTo({
        url: currentRoute,
        success: function() {
          console.log('页面刷新成功');
        },
        fail: function(error) {
          console.error('页面刷新失败', error);
          // 失败后尝试使用reLaunch
          wx.reLaunch({
            url: currentRoute,
            fail: function(err) {
              console.error('页面重新加载失败', err);
            }
          });
        }
      });
    },
    
    // 导航到首页
    navigateToHome: function() {
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
    
    // 点击更多按钮
    onMoreClick: function() {
      // 触发自定义事件
      this.triggerEvent('moreclick');
    },
    
    // 设置顶部距离的方法（供父组件调用）
    setTopDistance: function(distance) {
      if (typeof distance === 'number' && distance >= 0) {
        this.setData({
          topDistance: distance
        });
      }
    }
  }
})
