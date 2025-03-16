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
        content: '', // 初始为空，以便启用打字机效果
        fullContent: '> 欢迎来到海龟汤游戏。\n> 你需要通过提问来猜测谜底，\n> 我只会回答"是"、"否"或"不确定"。',
        isUser: false,
        pauseClass: 'pause-animation-2',
        isLatest: true,
        typingInProgress: true, // 标记为打字中
        isWelcomeMessage: true  // 标记为欢迎消息
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
    ],
    // 打字机效果控制相关
    typingConfig: {
      enabled: true,         // 是否启用打字机效果
      errorRate: 0.2,        // 打字错误率（0-1之间）
      backspaceChance: 0.3,  // 回退几率
      glitchChance: 0.15,    // 故障效果几率
      speedRange: [50, 150]  // 打字速度范围(ms)
    }
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
    
    // 启动欢迎消息的打字机效果
    setTimeout(() => {
      // 获取欢迎消息
      const initialMessage = this.data.messageList[0];
      if (initialMessage && initialMessage.typingInProgress) {
        this.simulateTypewriter(initialMessage.id, initialMessage.fullContent);
      }
    }, 500); // 延迟一下以确保页面已加载
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时执行入场动画
    this.pageEnterAnimation();
    
    // 尝试从本地存储加载对话记录
    this.loadMessageHistory();
    
    // 检查是否有未完成的打字效果，如果有则立即完成
    this.completeAllTypingAnimations();
    
    // 页面显示时自动滚动到底部
    this.setData({
      scrollToMessage: 'message-bottom'
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('对话页面隐藏');
    
    // 页面隐藏时，立即完成所有正在进行的打字效果
    this.completeAllTypingAnimations();
    
    // 保存消息历史到本地存储
    this.saveMessageHistory();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('对话页面卸载');
    
    // 页面卸载时，立即完成所有正在进行的打字效果
    this.completeAllTypingAnimations();
    
    // 保存消息历史到本地存储
    this.saveMessageHistory();
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
    // 处理">前缀"
    if (!message.isUser && message.content) {
      if (!message.content.trim().startsWith('>')) {
        message.content = message.content.split('\n').map(line => 
          line.trim() ? '> ' + line : line
        ).join('\n');
      }
    }
    
    // 标记原始完整内容用于打字机效果
    if (!message.isUser) {
      message.fullContent = message.content;
      // 如果启用打字机效果，初始设置为空
      if (this.data.typingConfig.enabled) {
        message.content = '';
        message.typingInProgress = true;
      }
    }
    
    // 如果是AI消息，先移除之前所有AI消息的isLatest标记和typingInProgress
    if (!message.isUser) {
      const updatedList = this.data.messageList.map(item => {
        if (!item.isUser) {
          return { 
            ...item, 
            isLatest: false,
            typingInProgress: false 
          };
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
        // 如果启用打字机效果，开始模拟打字
        if (this.data.typingConfig.enabled && message.typingInProgress) {
          this.simulateTypewriter(message.id, message.fullContent);
        }
        
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
   * 模拟打字机效果
   * @param {string|number} messageId 消息ID
   * @param {string} fullText 完整文本内容
   */
  simulateTypewriter: function(messageId, fullText) {
    let currentIndex = 0;
    let currentText = '';
    let backspacing = false;
    let backspaceCount = 0;
    let messageIndex = -1;
    let backspaceOccurrences = 0; // 记录回退发生的次数
    
    // 找到消息在列表中的索引
    this.data.messageList.forEach((msg, index) => {
      if (msg.id === messageId) {
        messageIndex = index;
      }
    });
    
    if (messageIndex === -1) return;
    
    const config = this.data.typingConfig;
    
    // 获取消息对象
    const message = this.data.messageList[messageIndex];
    
    // 检查是否是欢迎消息
    const isWelcomeMessage = message.isWelcomeMessage || message.id === 'init-1';
    
    // 为欢迎消息设置特殊参数
    let maxBackspaceOccurrences = isWelcomeMessage ? 1 : 2; // 减少回退次数，欢迎消息最多回退1次，其他消息最多2次
    let actualBackspaceChance = config.backspaceChance * 0.7; // 降低回退概率
    
    // 对于提示消息，进一步降低回退概率
    if (message.isHint) {
      actualBackspaceChance *= 0.5;
      maxBackspaceOccurrences = 1; // 提示消息最多回退1次
    }
    
    // 定时器函数
    const typeNextChar = () => {
      // 如果已完成或消息不存在，停止打字
      if (!this.data.messageList[messageIndex] || 
          !this.data.messageList[messageIndex].typingInProgress) {
        return;
      }
      
      // 如果正在回退
      if (backspacing && currentText.length > 0) {
        // 删除最后一个字符
        currentText = currentText.substring(0, currentText.length - 1);
        backspaceCount--;
        
        // 更新消息内容
        const updatedMessages = [...this.data.messageList];
        updatedMessages[messageIndex].content = currentText;
        
        this.setData({
          messageList: updatedMessages
        });
        
        // 如果回退完成
        if (backspaceCount <= 0) {
          backspacing = false;
        }
        
        // 继续回退或打字
        setTimeout(typeNextChar, Math.floor(Math.random() * 100) + 30);
        return;
      }
      
      // 随机决定是否触发故障
      const triggerGlitch = !isWelcomeMessage && Math.random() < config.glitchChance;
      
      // 随机决定是否触发打字错误和回退
      if (!backspacing && currentIndex > 0 && 
          backspaceOccurrences < maxBackspaceOccurrences) {
          
        // 欢迎消息特殊处理 - 只在特定位置回退
        if (isWelcomeMessage) {
          // 只在句子结束处考虑回退
          const isEndOfSentence = fullText.charAt(currentIndex - 1) === '。' || 
                                 fullText.charAt(currentIndex - 1) === '，' ||
                                 fullText.charAt(currentIndex - 1) === '\n';
          
          if (isEndOfSentence && Math.random() < actualBackspaceChance) {
            backspacing = true;
            backspaceOccurrences++;
            backspaceCount = 1; // 欢迎消息只回退1个字符
            
            setTimeout(typeNextChar, Math.floor(Math.random() * 100) + 30);
            return;
          }
        } 
        // 非欢迎消息的正常回退逻辑
        else if (Math.random() < actualBackspaceChance) {
          backspacing = true;
          backspaceOccurrences++;
          
          // 对于提示和"不确定"回复，可能回退更多字符
          if (message.isHint || (message.content && message.content.includes('不确定'))) {
            backspaceCount = Math.floor(Math.random() * 2) + 1; // 减少回退字符数，回退1-2个字符
          } else {
            backspaceCount = 1; // 其他消息只回退1个字符
          }
          
          setTimeout(typeNextChar, Math.floor(Math.random() * 100) + 30);
          return;
        }
      }
      
      // 打字完成
      if (currentIndex >= fullText.length) {
        // 标记打字完成
        const updatedMessages = [...this.data.messageList];
        updatedMessages[messageIndex].typingInProgress = false;
        updatedMessages[messageIndex].content = fullText;
        
        this.setData({
          messageList: updatedMessages
        });
        
        // 保存消息历史到本地存储
        this.saveMessageHistory();
        return;
      }
      
      // 添加下一个字符
      currentText += fullText.charAt(currentIndex);
      currentIndex++;
      
      // 如果触发故障，添加故障标记
      if (triggerGlitch) {
        const updatedMessages = [...this.data.messageList];
        updatedMessages[messageIndex].content = currentText;
        updatedMessages[messageIndex].glitching = true;
        
        this.setData({
          messageList: updatedMessages
        });
        
        // 短暂显示故障效果后恢复
        setTimeout(() => {
          const currentMessages = [...this.data.messageList];
          if (currentMessages[messageIndex]) {
            currentMessages[messageIndex].glitching = false;
            
            this.setData({
              messageList: currentMessages
            });
          }
        }, 150);
      } else {
        // 正常更新文本
        const updatedMessages = [...this.data.messageList];
        updatedMessages[messageIndex].content = currentText;
        
        this.setData({
          messageList: updatedMessages
        });
        
        // 每添加10个字符保存一次消息历史，确保页面切换时不丢失内容
        if (currentIndex % 10 === 0) {
          this.saveMessageHistory();
        }
      }
      
      // 设置下一个字符的打字延时
      let typingSpeed = Math.floor(Math.random() * 
                       (config.speedRange[1] - config.speedRange[0])) + 
                       config.speedRange[0];
      
      // 欢迎消息稍微加快打字速度
      if (isWelcomeMessage) {
        typingSpeed = Math.max(15, typingSpeed - 25); // 减少25ms，但不低于15ms
      }
      // 对于提示和"不确定"回复，可能打字速度更慢，表示思考
      else if (message.isHint || (message.content && message.content.includes('不确定'))) {
        typingSpeed += Math.floor(Math.random() * 50); // 增加0-50ms的延迟
      }
      
      setTimeout(typeNextChar, typingSpeed);
    };
    
    // 开始打字
    typeNextChar();
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
      let backspaceChanceModifier = 0; // 回退概率修饰符
      
      // 简单的关键词匹配
      const question = userQuestion.toLowerCase();
      
      if (question.includes('吃') || question.includes('食物')) {
        response = '是。';
        isCorrectGuess = true;
        backspaceChanceModifier = -0.2; // 降低回退概率
      } else if (question.includes('人') || question.includes('自己')) {
        response = '是。';
        isCorrectGuess = true;
        backspaceChanceModifier = -0.2; // 降低回退概率
      } else if (question.includes('动物')) {
        response = '是。';
        isCorrectGuess = true;
        backspaceChanceModifier = -0.2; // 降低回退概率
      } else if (question.includes('谜底')) {
        response = '不是。';
        backspaceChanceModifier = -0.15; // 稍微降低回退概率
      } else {
        // 随机回复
        const responses = ['是。', '否。', '不确定。'];
        response = responses[Math.floor(Math.random() * responses.length)];
        
        // 如果回复是"否"或"不确定"，增加错误计数
        if (response === '否。') {
          this.increaseWrongGuessCount();
          backspaceChanceModifier = -0.15; // 稍微降低回退概率
        } else if (response === '不确定。') {
          this.increaseWrongGuessCount();
          backspaceChanceModifier = 0.1; // 提高回退概率，表示思考
        } else {
          // 如果回复是"是"，重置错误计数
          this.resetWrongGuessCount();
          backspaceChanceModifier = -0.2; // 降低回退概率
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
        content: '> ' + response, // 确保回复以">"开头
        fullContent: '> ' + response, // 保存完整内容用于打字机效果
        isUser: false,
        pauseClass: pauseClass,
        typingInProgress: this.data.typingConfig.enabled, // 标记打字进行中
        backspaceChanceModifier: backspaceChanceModifier // 添加回退概率修饰符
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
        content: '> ' + hint, // 确保提示也以">"开头
        fullContent: '> ' + hint, // 保存完整内容用于打字机效果
        isUser: false,
        pauseClass: pauseClass,
        isHint: true, // 标记为提示消息
        typingInProgress: this.data.typingConfig.enabled, // 标记打字进行中
        backspaceChanceModifier: 0.15 // 提示消息增加回退概率，表示思考
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
        // 应用惊悚风格
        this.applyHorrorStyle();
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
   * 应用惊悚风格
   * 确保打字机效果和光标样式符合惊悚风格
   */
  applyHorrorStyle: function() {
    console.log('应用惊悚风格');
    
    // 微信小程序不支持直接操作样式
    this.setData({
      horrorStyleApplied: true,
      // 启用打字机效果配置
      typingConfig: {
        enabled: true,
        errorRate: 0.15,
        backspaceChance: 0.2, // 基础回退概率，会根据消息类型调整
        glitchChance: 0.2,
        speedRange: [30, 120]
      }
    });
  },

  /**
   * 处理home按钮点击事件
   */
  onHomeClick: function() {
    console.log('首页按钮被点击');
    
    // 保存对话记录
    this.saveMessageHistory();
    
    // 返回首页
    wx.reLaunch({
      url: '/pages/login/login',
      success: function() {
        console.log('返回首页成功');
      },
      fail: function(error) {
        console.error('返回首页失败', error);
      }
    });
  },
  
  /**
   * 处理更多按钮点击事件
   */
  onMoreClick: function() {
    console.log('更多按钮被点击');
    // 显示操作菜单
    wx.showActionSheet({
      itemList: ['重新开始', '保存对话', '分享汤面', '设置'],
      success: (res) => {
        console.log(res.tapIndex);
        // 根据点击的选项执行不同操作
        switch(res.tapIndex) {
          case 0: // 重新开始
            this.resetConversation();
            break;
          case 1: // 保存对话
            this.saveMessageHistory();
            wx.showToast({
              title: '对话已保存',
              icon: 'success'
            });
            break;
          case 2: // 分享汤面
            wx.showShareMenu({
              withShareTicket: true,
              menus: ['shareAppMessage', 'shareTimeline']
            });
            break;
          case 3: // 设置
            // 打开设置页面
            break;
        }
      }
    });
  },
  
  /**
   * 重置对话
   */
  resetConversation: function() {
    // 重置对话到初始状态
    const initialMessage = {
      id: 'init-' + Date.now(),
      content: '', // 初始为空，以便启用打字机效果
      fullContent: '> 欢迎来到海龟汤游戏。\n> 你需要通过提问来猜测汤底，\n> 我只会回答"是"、"否"或"不确定"。',
      isUser: false,
      pauseClass: 'pause-animation-2',
      isLatest: true,
      typingInProgress: true,
      isWelcomeMessage: true
    };
    
    this.setData({
      messageList: [initialMessage],
      wrongGuessCount: 0
    }, () => {
      // 启动欢迎消息的打字机效果
      setTimeout(() => {
        this.simulateTypewriter(initialMessage.id, initialMessage.fullContent);
      }, 500);
    });
    
    // 清除本地存储的对话记录
    wx.removeStorageSync('messageHistory');
  },
  
  /**
   * 立即完成所有正在进行的打字效果
   */
  completeAllTypingAnimations: function() {
    // 检查是否有正在进行的打字效果
    const updatedMessages = [...this.data.messageList];
    let hasChanges = false;
    
    updatedMessages.forEach((message) => {
      if (message.typingInProgress) {
        // 立即完成打字效果，显示完整内容
        message.typingInProgress = false;
        message.content = message.fullContent;
        hasChanges = true;
      }
    });
    
    // 如果有更新，设置数据
    if (hasChanges) {
      this.setData({
        messageList: updatedMessages
      });
    }
  }
}) 