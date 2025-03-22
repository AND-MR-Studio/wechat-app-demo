# 一勺海龟汤 小程序项目

## 项目结构说明

本项目是一个提供海龟汤的小程序，主要包含以下功能页面：

### 1. 页面结构

- **Home页面** (`pages/home/home`): 作为应用首页，展示每日海龟汤内容
- **Main页面** (`pages/main/main`): 提供对话功能，用户可以与一勺海龟汤进行互动

### 2. 页面功能说明

#### Home页面 (pages/home/home)
- 作为应用首页，展示每日海龟汤内容
- 提供"开始喝汤"按钮进入对话页面
- 支持通过home按钮刷新页面
- 菜单提供关于、设置等功能

#### Main页面 (pages/main/main)
- 提供对话功能，用户可以与一勺海龟汤进行互动
- 从首页的"开始喝汤"按钮进入

### 3. 导航栏组件

导航栏组件(`pages/components/nav-bar`)具有以下功能：

- 在首页上点击home按钮：刷新当前页面
- 在其他页面点击home按钮：返回首页
- 支持自定义标题和样式

### 4. 如何使用导航栏组件

在页面中使用导航栏组件时，需要指定以下参数：

```xml
<nav-bar 
  title="页面标题" 
  isHomePage="{{true/false}}" 
  bind:homeclick="onHomeClick"
  bind:moreclick="onMoreClick">
</nav-bar>
```

#### 参数说明
- `title`: 导航栏标题
- `isHomePage`: 是否是首页，影响home按钮行为
- `bind:homeclick`: 绑定home按钮点击事件
- `bind:moreclick`: 绑定更多按钮点击事件

## 开发注意事项

1. 确保app.json中的页面顺序正确，首页应为"pages/home/home"
2. 导航逻辑已经更新，跳转到首页的代码应使用"/pages/home/home"
3. 当前版本不包含用户登录功能