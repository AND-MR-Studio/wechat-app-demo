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
    fontLoaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('登录页面加载');
    
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
   * 加载自定义字体
   */
  loadCustomFont: function() {
    console.log('开始加载字体');
    
    // 直接开始文字动画，不等待字体加载
    // 因为字体加载可能会失败，但我们仍然需要显示文本
    setTimeout(() => {
      this.startTextAnimation();
    }, 500);
    
    // 尝试加载自定义字体
    wx.loadFontFace({
      family: 'HuiWenMingTi',
      source: 'url("https://yavin-miniprogram-1322698236.cos.ap-guangzhou.myqcloud.com/HuiWenMingChao.ttf")',
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
    
    // 同时设置显示和打字动画状态，避免中间有渲染间隙
    this.setData({
      showMainTitle: true,
      mainTitleTyping: true
    });
    
    // 主标题动画完成后，依次播放副标题动画
    setTimeout(() => {
      this.playSubtitleAnimation(0);
    }, 2500); // 主标题动画时长
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
    console.log('登录页面显示');
    
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
      
      // 延迟一点，确保状态重置后再开始动画
      setTimeout(() => {
        this.startTextAnimation();
      }, 300);
    }
    
    // 重置按钮和背景动画状态
    const buttonAnimation = wx.createAnimation({
      duration: 0
    });
    
    const backgroundAnimation = wx.createAnimation({
      duration: 0
    });
    
    // 重置按钮样式 - 只设置透明度，不使用缩放
    buttonAnimation.opacity(1).step();
    
    // 重置背景样式
    backgroundAnimation.opacity(1).step();
    
    // 应用动画
    this.setData({
      buttonAnimation: buttonAnimation.export(),
      backgroundAnimation: backgroundAnimation.export(),
      buttonAnimating: false,
      backgroundAnimating: false
    });
  },

  /**
   * 处理home按钮点击事件
   */
  onHomeClick: function() {
    console.log('首页按钮被点击');
    // 在首页点击home按钮可以刷新页面或重新开始动画
    this.setData({
      showMainTitle: false,
      showSubTitle: [false, false, false, false],
      mainTitleTyping: false,
      subTitleTyping: [false, false, false, false],
      buttonVisible: false
    });
    
    // 延迟一点，确保状态重置后再开始动画
    setTimeout(() => {
      this.startTextAnimation();
    }, 300);
  },
  
  /**
   * 处理更多按钮点击事件
   */
  onMoreClick: function() {
    console.log('更多按钮被点击');
    // 这里可以添加显示菜单或其他功能的逻辑
    wx.showActionSheet({
      itemList: ['关于一日汤', '设置', '反馈问题'],
      success: (res) => {
        console.log(res.tapIndex);
        // 根据点击的选项执行不同操作
      }
    });
  }
}) 