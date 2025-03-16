// main.js
// 引入工具类
const util = require('../../utils/util.js')

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
        content: '欢迎来到海龟汤游戏。\n你需要通过提问来猜测谜底，\n我只会回答"是"、"否"或"不确定"。',
        isUser: false,
        pauseClass: 'pause-animation-2',
        isLatest: true
      }
    ],
    // 输入框的值
    inputValue: '',
    // 滚动到的消息ID
    scrollToMessage: 'message-bottom',
    // 输入框是否聚焦
    inputFocused: false,
    // 是否正在发送消息
    sending: false,
    // 连续猜错或不确定的次数
    wrongGuessCount: 0,
    // 提示列表
    hintList: [
      "提示：试着从汤面的关键词入手思考。",
      "提示：汤底与食物链有关。",
      "提示：想想人与动物的关系。",
      "提示：考虑一下'自己'在汤面中代表什么。",
      "提示：汤面描述的可能是一个进食的过程。",
      "提示：'同类'这个词很重要，它暗示了什么？",
      "提示：想象一下从动物到人的转变过程。",
      "提示：汤底可能与某种特殊的食物有关。",
      "提示：试着从不同的角度解读'最后是自己'。",
      "提示：汤底可能与某种特殊的食物习惯有关。"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('对话页面加载');
    
    // 加载自定义字体
    this.loadCustomFont();
    
    // 可以从options中获取传递过来的海龟汤数据
    // 或者从服务器获取
    
    // 尝试从本地存储加载对话记录
    this.loadMessageHistory();
    
    // 页面加载时自动滚动到底部
    this.setData({
      scrollToMessage: 'message-bottom'
    });
    
    // 记录日志
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时执行入场动画
    this.pageEnterAnimation();
    
    // 尝试从本地存储加载对话记录
    this.loadMessageHistory();
  },

  /**
   * 从本地存储加载对话记录
   */
  loadMessageHistory: function() {
    try {
      const messageHistory = wx.getStorageSync('messageHistory');
      if (messageHistory && messageHistory.length > 0) {
        // 找到最后一条AI消息，标记为最新
        const updatedList = messageHistory.map((item, index) => {
          if (!item.isUser && index === messageHistory.length - 1) {
            return { ...item, isLatest: true };
          } else if (!item.isUser) {
            return { ...item, isLatest: false };
          }
          return item;
        });
        
        this.setData({
          messageList: updatedList
        });
      }
    } catch (e) {
      console.error('加载对话记录失败', e);
    }
  },

  /**
   * 保存对话记录到本地存储
   */
  saveMessageHistory: function() {
    try {
      // 过滤掉思考中的消息
      const messageToSave = this.data.messageList.filter(item => !item.isThinking);
      wx.setStorageSync('messageHistory', messageToSave);
    } catch (e) {
      console.error('保存对话记录失败', e);
    }
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
    
    // 保存对话记录
    this.saveMessageHistory();
    
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
    // 如果是AI消息，先移除之前所有AI消息的isLatest标记
    if (!message.isUser) {
      const updatedList = this.data.messageList.map(item => {
        if (!item.isUser) {
          return { ...item, isLatest: false };
        }
        return item;
      });
      
      // 标记当前AI消息为最新
      message.isLatest = true;
      
      const messageList = updatedList.concat(message);
      
      this.setData({
        messageList: messageList,
        scrollToMessage: `msg-${message.id}`
      }, () => {
        // 保存对话记录
        this.saveMessageHistory();
      });
    } else {
      // 用户消息直接添加
      const messageList = this.data.messageList.concat(message);
      
      this.setData({
        messageList: messageList,
        scrollToMessage: `msg-${message.id}`
      }, () => {
        // 保存对话记录
        this.saveMessageHistory();
      });
    }
  },

  /**
   * 模拟AI回复
   * 在实际应用中，这里应该调用后端API获取回复
   */
  simulateAIResponse: function (userQuestion) {
    // 设置思考状态
    const thinkingMessage = {
      id: 'thinking-' + Date.now(),
      content: '',
      isUser: false,
      isThinking: true,
      pauseClass: 'pause-animation-1'
    };
    
    // 将思考消息添加到消息列表
    this.addThinkingMessage(thinkingMessage);
    
    // 模拟网络延迟和思考时间
    const thinkingTime = 1500 + Math.random() * 2000; // 1.5-3.5秒的思考时间
    
    setTimeout(() => {
      // 移除思考消息
      this.removeThinkingMessage();
      
      // 简单的回复逻辑，实际应用中应该调用AI服务
      let response = '';
      let isCorrectGuess = false;
      
      // 简单的关键词匹配
      const question = userQuestion.toLowerCase();
      
      if (question.includes('吃') || question.includes('食物')) {
        response = '是。';
        isCorrectGuess = true;
      } else if (question.includes('人') || question.includes('自己')) {
        response = '是。';
        isCorrectGuess = true;
      } else if (question.includes('动物')) {
        response = '是。';
        isCorrectGuess = true;
      } else if (question.includes('谜底')) {
        response = '不是。';
      } else {
        // 随机回复
        const responses = ['是。', '否。', '不确定。'];
        response = responses[Math.floor(Math.random() * responses.length)];
        
        // 如果回复是"否"或"不确定"，增加错误计数
        if (response === '否。' || response === '不确定。') {
          this.increaseWrongGuessCount();
        } else {
          // 如果回复是"是"，重置错误计数
          this.resetWrongGuessCount();
        }
      }
      
      // 如果是正确的猜测，重置错误计数
      if (isCorrectGuess) {
        this.resetWrongGuessCount();
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
      
      // 检查是否需要给出提示
      this.checkAndGiveHint();
      
      // 重置发送状态
      this.setData({
        sending: false
      });
    }, thinkingTime);
  },
  
  /**
   * 添加思考消息到列表
   */
  addThinkingMessage: function (message) {
    // 移除之前所有AI消息的isLatest标记
    const updatedList = this.data.messageList.map(item => {
      if (!item.isUser) {
        return { ...item, isLatest: false };
      }
      return item;
    });
    
    // 标记当前思考消息为最新
    message.isLatest = true;
    
    const messageList = updatedList.concat(message);
    
    this.setData({
      messageList: messageList,
      scrollToMessage: `msg-${message.id}`
    });
  },
  
  /**
   * 移除思考消息
   */
  removeThinkingMessage: function () {
    // 过滤掉所有思考消息
    const filteredList = this.data.messageList.filter(item => !item.isThinking);
    
    this.setData({
      messageList: filteredList
    });
  },

  /**
   * 增加错误猜测计数
   */
  increaseWrongGuessCount: function() {
    this.setData({
      wrongGuessCount: this.data.wrongGuessCount + 1
    });
    console.log('连续错误次数：', this.data.wrongGuessCount);
  },
  
  /**
   * 重置错误猜测计数
   */
  resetWrongGuessCount: function() {
    this.setData({
      wrongGuessCount: 0
    });
    console.log('错误次数已重置');
  },
  
  /**
   * 检查是否需要给出提示
   */
  checkAndGiveHint: function() {
    // 如果连续猜错或不确定3次，给出提示
    if (this.data.wrongGuessCount >= 3) {
      // 随机选择一个提示
      const randomIndex = Math.floor(Math.random() * this.data.hintList.length);
      const hint = this.data.hintList[randomIndex];
      
      // 随机选择一个停顿动画类
      const pauseClasses = ['pause-animation-1', 'pause-animation-2', 'pause-animation-3', 'pause-animation-4'];
      const pauseClass = pauseClasses[Math.floor(Math.random() * pauseClasses.length)];
      
      // 创建提示消息对象
      const hintMessage = {
        id: Date.now() + 100, // 确保ID不重复
        content: hint,
        isUser: false,
        pauseClass: pauseClass,
        isHint: true
      };
      
      // 延迟一段时间后显示提示，让用户先看到AI的回复
      setTimeout(() => {
        // 将提示消息添加到消息列表
        this.addMessage(hintMessage);
        
        // 重置错误计数
        this.resetWrongGuessCount();
      }, 1500);
    }
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
  }
}) 