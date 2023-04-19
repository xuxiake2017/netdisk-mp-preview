## Netdisk 小程序（我的照片墙）

#### 运行项目之前


> 安装npm依赖
``` bash
npm install
```

> 构建 npm

点击开发者工具中的菜单栏：工具 --> 构建 npm

![构建 npm](https://github.com/xuxiake2017/netdisk-mp-preview/blob/master/pic/npm1.png?raw=true)

勾选“使用 npm 模块”选项

![勾选“使用 npm 模块”选项](https://github.com/xuxiake2017/netdisk-mp-preview/blob/master/pic/npm2.png?raw=true)

> NPM使用具体参考

- [微信官方](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)
- [Vant](https://vant-contrib.gitee.io/vant-weapp/#/quickstart)

#### 项目截图
<div align="left">
    <img src="https://github.com/xuxiake2017/netdisk-mp-preview/blob/master/pic/preview_1.jpg?raw=true" width="200" title="preview_1" /><img src="https://github.com/xuxiake2017/netdisk-mp-preview/blob/master/pic/preview_2.jpg?raw=true" width="200" title="preview_2" /><img src="https://github.com/xuxiake2017/netdisk-mp-preview/blob/master/pic/preview_3.jpg?raw=true" width="200" title="preview_3" /><img src="https://github.com/xuxiake2017/netdisk-mp-preview/blob/master/pic/preview_4.jpg?raw=true" width="200" title="preview_4" />
  </div>

#### 项目预览

<div align="left">
    <img src="https://github.com/xuxiake2017/netdisk-mp-preview/blob/master/pic/gh_3c0eeb9635a2_258.jpg?raw=true" width="200" title="preview_1" />
  </div>

#### 鸣谢

全局样式（`padding`、`margin`以及`flex`）和部分工具函数使用的[uView](https://github.com/YanxinNet/uView)里面的

#### 更新日志

##### 2021-06-13

- 优化小程序的登陆体验
- 增加文件上传（图片、视频、聊天对话选择文件）
- 增加文件移动

##### 2021-06-14

- 增加我的相册页
- 删除无用资源

##### 2021-06-16

- 增加个人中心页

##### 2021-06-30

- 增加切换账号按钮（可重新绑定新的手机号）
- 增加搜索页
- 首页以及相册页增加下拉刷新
- 安装官方的`@types/wechat-miniprogram`增加提示支持（早该弄）

##### 2021-07-04

- 增加音乐播放器
- 增加小程序分享
- 增加首页排序

##### 2023-01-05

- 未登录不再直接跳转到登录页（微信要求整改）

##### 2023-03-23

- 增加头像、昵称修改界面

##### 2023-03-28

- 增加文件下载保存功能