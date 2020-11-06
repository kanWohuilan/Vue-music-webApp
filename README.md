# vue-music

## Project setup

```

npm install

```

### Compiles and hot-reloads for development

```

npm run serve

```

### Compiles and minifies for production

```

npm run build

```

### Lints and fixes files

```

npm run lint

```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

项目启动前必须先在本地服务器端口部署网易云音乐APi,默认30端口

## **技术栈**

【前端】

- Vue：用于构建用户界面的 MVVM 框架。它的核心是 **响应的数据绑定** 和 **组系统件**
- vue-router：为单页面应用提供的路由系统，项目上线前使用了 Lazy Loading Routes 技术来实现异步加载优化性能
- vuex：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
- vue-lazyload：第三方图片懒加载库，优化页面加载速度
- better-scroll：iscroll 的优化版，使移动端滑动体验更加流畅
- Stylus：css 预编译处理器
- ES6：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用
- Vue-svg-icon：实现svg小图标展示的组件插件

【API】

- NeteaseCloudMusicApi：网易云接口文档 https://binaryify.github.io/NeteaseCloudMusicApi/#/

【自动化构建及其他工具】

- webpack：项目的编译打包
- vue-cli：Vue 脚手架工具，快速搭建项目
- eslint：代码风格检查工具，规范代码格式
- vConsole：移动端调试工具，在移动端输出日志

## **实现页面**

主要页面：播放器内核页、推荐页、歌单详情页、歌手页、歌手详情页、排行页、搜索页、添加歌曲页、

、推荐MV页、个人中心页等。

核心页面：播放器内核页

**其他**

此应用的数据来自 QQ音乐和网易云音乐，全局通用的应用级状态使用 vuex 集中管理

全局引入 fastclick 库，消除 click 移动浏览器300ms延迟

页面是响应式的，适配常见的移动端屏幕，采用 flex 布局