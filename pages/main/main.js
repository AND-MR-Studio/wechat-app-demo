// main.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前海龟汤数据
    currentSoup: {
      title: '最后是自己',
      content: '一开始是动物，然后是同类的尸体，接着是同类，最后是自己。'
    },
    // 消息列表
    messageList: [
      {
        id: 'init-1',
        content: '我是人吗？',
        isUser: true
      },
      {
        id: 'init-2',
        content: '是。',
        isUser: false,
        pauseClass: 'pause-animation-1'
      },
      {
        id: 'init-3',
        content: '或许同类指的是：',
        isUser: true
      },
      {
        id: 'init-4',
        content: '不是。',
        isUser: false,
        pauseClass: 'pause-animation-2'
      },
      {
        id: 'init-5',
        content: 'x',
        isUser: true
      },
      {
        id: 'init-6',
        content: '是。',
        isUser: false,
        pauseClass: 'pause-animation-3'
      },
      {
        id: 'init-7',
        content: 'f',
        isUser: true
      },
      {
        id: 'init-8',
        content: '否。',
        isUser: false,
        pauseClass: 'pause-animation-4'
      },
      {
        id: 'init-9',
        content: 'd',
        isUser: true
      },
      {
        id: 'init-10',
        content: '不确定。',
        isUser: false,
        pauseClass: 'pause-animation-1'
      },
      {
        id: 'init-11',
        content: '是、',
        isUser: true
      },
      {
        id: 'init-12',
        content: '不确定。',
        isUser: false,
        pauseClass: 'pause-animation-2'
      }
    ],
    // 输入框的值
    inputValue: '',
    // 滚动到的消息ID
    scrollToMessage: 'message-bottom',
    // 输入框是否聚焦
    inputFocused: false,
    // 是否正在发送消息
    sending: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 可以从options中获取传递过来的海龟汤数据
    // 或者从服务器获取
    
    // 页面加载时自动滚动到底部
    this.setData({
      scrollToMessage: 'message-bottom'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时执行入场动画
    this.pageEnterAnimation();
  },

  /**
   * 页面入场动画
   */
  pageEnterAnimation: function () {
    // 这里可以添加页面入场动画的逻辑
    // 由于小程序不支持直接操作DOM，可以考虑使用wx.createAnimation
    // 或者通过设置CSS类来实现动画效果
  },

  /**
   * 返回上一页
   */
  navigateBack: function () {
    console.log('返回按钮被点击');
    
    // 直接使用navigateBack返回上一页
    wx.navigateBack({
      delta: 1,
      success: function() {
        console.log('返回成功');
      },
      fail: function(err) {
        console.error('返回失败', err);
        // 如果返回失败，尝试重定向到登录页
        wx.reLaunch({
          url: '/pages/login/login',
          success: function() {
            console.log('重定向到登录页成功');
          },
          fail: function(error) {
            console.error('重定向失败', error);
          }
        });
      }
    });
  },

  /**
   * 输入框聚焦事件处理函数
   */
  onInputFocus: function () {
    this.setData({
      inputFocused: true
    });
  },

  /**
   * 输入框失焦事件处理函数
   */
  onInputBlur: function () {
    this.setData({
      inputFocused: false
    });
  },

  /**
   * 输入框内容变化事件处理函数
   */
  onInputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  /**
   * 发送消息事件处理函数
   */
  sendMessage: function () {
    // 获取输入内容
    const content = this.data.inputValue.trim();
    
    // 如果输入为空，则不处理
    if (!content) {
      return;
    }
    
    // 设置发送状态
    this.setData({
      sending: true
    });
    
    // 创建用户消息对象
    const userMessage = {
      id: Date.now(),
      content: content,
      isUser: true
    };
    
    // 将用户消息添加到消息列表
    this.addMessage(userMessage);
    
    // 清空输入框
    this.setData({
      inputValue: ''
    });
    
    // 模拟AI回复
    this.simulateAIResponse(content);
  },

  /**
   * 添加消息到列表
   */
  addMessage: function (message) {
    const messageList = this.data.messageList.concat(message);
    
    this.setData({
      messageList: messageList,
      scrollToMessage: `msg-${message.id}`
    });
  },

  /**
   * 模拟AI回复
   * 在实际应用中，这里应该调用后端API获取回复
   */
  simulateAIResponse: function (userQuestion) {
    // 模拟网络延迟
    setTimeout(() => {
      // 简单的回复逻辑，实际应用中应该调用AI服务
      let response = '';
      
      // 简单的关键词匹配
      const question = userQuestion.toLowerCase();
      
      if (question.includes('吃') || question.includes('食物')) {
        response = '是。';
      } else if (question.includes('人') || question.includes('自己')) {
        response = '是。';
      } else if (question.includes('动物')) {
        response = '是。';
      } else if (question.includes('谜底')) {
        response = '不是。';
      } else {
        // 随机回复
        const responses = ['是。', '否。', '不确定。'];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      // 随机选择一个停顿动画类
      const pauseClasses = ['pause-animation-1', 'pause-animation-2', 'pause-animation-3', 'pause-animation-4'];
      const pauseClass = pauseClasses[Math.floor(Math.random() * pauseClasses.length)];
      
      // 创建AI消息对象
      const aiMessage = {
        id: Date.now(),
        content: response,
        isUser: false,
        pauseClass: pauseClass
      };
      
      // 将AI消息添加到消息列表
      this.addMessage(aiMessage);
      
      // 重置发送状态
      this.setData({
        sending: false
      });
    }, 800);
  }
}) 