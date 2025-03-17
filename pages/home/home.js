// home.js
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
    backgroundAnimating: false,
    // 按钮是否可见
    buttonVisible: false,
    // 主标题是否显示
    showMainTitle: false,
    // 副标题是否显示
    showSubTitle: [false, false, false, false],
    // 主标题打字状态
    mainTitleTyping: false,
    // 副标题打字状态
    subTitleTyping: [false, false, false, false],
    // 是否完成所有文字动画
    allTextAnimationComplete: false,
    // 字体是否加载完成
    fontLoaded: false,
    // 状态栏高度（供导航栏使用）
    statusBarHeight: 20,
    // 底部栏选中状态
    activeTab: 'drink' // 默认选中喝汤功能
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('首页加载');
    
    // 获取系统信息设置状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight || 20
    });
    
    // 加载自定义字体
    this.loadCustomFont();
    
    // 初始化按钮和背景动画
    const buttonAnimation = wx.createAnimation({
      duration: 0
    });
    
    const backgroundAnimation = wx.createAnimation({
      duration: 0
    });
    
    // 设置初始样式 - 只设置透明度，不使用缩放
    buttonAnimation.opacity(1).step();
    backgroundAnimation.opacity(1).step();
    
    // 应用动画
    this.setData({
      buttonAnimation: buttonAnimation.export(),
      backgroundAnimation: backgroundAnimation.export(),
      buttonVisible: false,
      showMainTitle: false,
      showSubTitle: [false, false, false, false]
    });
  },

  /**
   * 点击导航栏中的home按钮
   */
  onHomeClick: function() {
    console.log('点击home按钮，刷新首页');
    // 刷新当前页面
    this.refreshPage();
  },

  /**
   * 刷新页面
   */
  refreshPage: function() {
    // 重新加载数据
    // 重置状态
    this.setData({
      showMainTitle: false,
      showSubTitle: [false, false, false, false],
      mainTitleTyping: false,
      subTitleTyping: [false, false, false, false],
      buttonVisible: false,
      allTextAnimationComplete: false
    });
    
    // 延迟重新开始动画
    setTimeout(() => {
      this.startTextAnimation();
    }, 300); // 增加延迟，确保状态重置完成
  },

  /**
   * 点击右上角更多按钮
   */
  onMoreClick: function() {
    // 显示操作菜单
    wx.showActionSheet({
      itemList: ['关于一勺海龟汤', '设置', '反馈问题'],
      success: (res) => {
        console.log(res.tapIndex);
        // 根据点击的选项执行不同操作
        switch(res.tapIndex) {
          case 0: // 关于一勺海龟汤
            wx.showModal({
              title: '关于一勺海龟汤',
              content: '一勺海龟汤是一款每日为您提供海龟汤谜题的小程序。和AI对话一步步解开谜底。',
              showCancel: false
            });
            break;
          case 1: // 设置
            wx.showToast({
              title: '设置功能开发中',
              icon: 'none'
            });
            break;
          case 2: // 反馈问题
            wx.showToast({
              title: '反馈功能开发中',
              icon: 'none'
            });
            break;
        }
      }
    });
  },

  /**
   * 加载自定义字体
   */
  loadCustomFont: function() {
    console.log('开始加载字体');
    
    // 直接开始文字动画，不等待字体加载
    // 因为字体加载可能会失败，但我们仍然需要显示文本
    setTimeout(() => {
      this.startTextAnimation();
    }, 800); // 增加延迟，让页面完全加载
    
    // 尝试加载自定义字体
    wx.loadFontFace({
      family: 'HuiWenMingTi',
      source: 'url("https://yavin-miniprogram-1322698236.cos.ap-chengdu.myqcloud.com/HuiWenMingChao.ttf")',
      success: (res) => {
        console.log('字体加载成功', res);
        this.setData({
          fontLoaded: true
        });
      },
      fail: (err) => {
        console.log('字体加载失败', err);
        // 字体加载失败时，使用系统默认字体
        this.setData({
          fontLoaded: false
        });
      },
      complete: (res) => {
        console.log('字体加载完成', res);
      }
    });
  },

  /**
   * 开始文字动画
   */
  startTextAnimation: function() {
    console.log('开始文字动画');
    
    // 确保之前的动画状态已重置
    this.setData({
      showMainTitle: false,
      showSubTitle: [false, false, false, false],
      mainTitleTyping: false,
      subTitleTyping: [false, false, false, false]
    });

    // 延迟一下再开始新动画，避免动画冲突
    setTimeout(() => {
      // 同时设置显示和打字动画状态，避免中间有渲染间隙
      this.setData({
        showMainTitle: true,
        mainTitleTyping: true
      });
      
      // 主标题动画完成后，依次播放副标题动画
      setTimeout(() => {
        this.playSubtitleAnimation(0);
      }, 2500); // 主标题动画时长
    }, 100);
  },
  
  /**
   * 播放副标题动画
   */
  playSubtitleAnimation: function(index) {
    console.log('播放副标题动画', index);
    
    if (index >= 4) {
      // 所有副标题动画都完成后，显示按钮
      setTimeout(() => {
        console.log('所有动画完成，显示按钮');
        this.setData({
          allTextAnimationComplete: true,
          buttonVisible: true
        });
      }, 500);
      return;
    }
    
    // 同时更新显示状态和动画状态，避免中间有渲染间隙
    let showSubTitle = [...this.data.showSubTitle];
    let subTitleTyping = [...this.data.subTitleTyping];
    
    showSubTitle[index] = true;
    subTitleTyping[index] = true;
    
    this.setData({
      showSubTitle: showSubTitle,
      subTitleTyping: subTitleTyping
    });
    
    // 根据不同副标题的动画时长设置延迟
    const animationDurations = [1800, 2200, 1500, 1700];
    
    // 当前副标题动画完成后，播放下一个副标题动画
    setTimeout(() => {
      this.playSubtitleAnimation(index + 1);
    }, animationDurations[index]);
  },

  /**
   * 点击开始按钮的事件处理函数
   */
  onStartTap: function () {
    console.log('点击开始按钮');
    
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
      timingFunction: 'ease-out',
      delay: 0
    });
    
    // 创建背景动画
    const backgroundAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    
    // 按钮只淡出，不缩小
    buttonAnimation.opacity(0).step();
    
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
    console.log('首页显示');
    
    if (this.data.allTextAnimationComplete) {
      // 如果所有文字动画已完成，显示所有文字元素和按钮
      this.setData({
        showMainTitle: true,
        showSubTitle: [true, true, true, true],
        buttonVisible: true
      });
    } else {
      // 如果重新回到页面，但文字动画未完成，重新开始文字动画
      // 重置所有状态
      this.setData({
        showMainTitle: false,
        showSubTitle: [false, false, false, false],
        mainTitleTyping: false,
        subTitleTyping: [false, false, false, false],
        buttonVisible: false
      });
      
      // 延迟重新开始动画
      setTimeout(() => {
        this.startTextAnimation();
      }, 800); // 增加延迟，确保状态能够完全重置
    }
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
      timingFunction: 'ease-out',
      delay: 0
    });
    
    // 创建背景动画
    const backgroundAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    });
    
    // 按钮只淡出，不缩小
    buttonAnimation.opacity(0).step();
    
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
  }
}) 