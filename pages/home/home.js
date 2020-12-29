import { GetFileList } from '../../api/file'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    windowWidth: 0,
    // 当前tab
    active: 1,
    // tabs
    tabs: [
      {
        label: '网盘文件',
        value: 1
      },
      {
        label: '文件分享',
        value: 2
      },
      {
        label: '个人中心',
        value: 3
      }
    ],
    // 文件列表
    fileList: [],
    // 分页参数
    pagination: {
      total: 0,
      pageNum: 1,
      pageSize: 10
    },
    // 查询过滤条件
    filters: {
      parentId: -1,
      fileRealName: ''
    },
    // 是否展示文件操作弹窗
    show: false,
    // 文件操作选项
    fileOptions: [
      {
        name: '分享',
        icon: 'icon-share'
      },
      {
        name: '复制',
        icon: 'icon-copy'
      },
      {
        name: '重命名',
        icon: 'icon-rename'
      },
      {
        name: '删除',
        icon: 'icon-delete'
      },
    ],
    // 加载中
    loading: false,
    // 加载结束
    finished: false
  },
  // tab切换
  onChange(event) {
    this.setData({
      active: event.detail.name
    })
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  // 对文件进行操作
  fileOptHandler() {
    this.setData({
      show: true
    })
  },
  // 文件操作对话框关闭
  onPopupClose() {
    this.setData({
      show: false
    })
  },
  // 获取文件列表
  getFileList() {
    this.setData({
      loading: true
    })
    const params = {
      ...this.data.pagination,
      ...this.data.filters
    }
    setTimeout(() => {
      GetFileList(params).then(res => {
        this.setData({
          loading: false
        })
        const data = res.data
        const {
          list,
          pageNum,
          pageSize,
          total
        } = data.pageInfo
        let finished = false
        // 判断是否结束加载
        if(pageNum * pageSize >= total) {
          finished = true
        }
        this.setData({
          fileList: [ ...this.data.fileList, ...list ],
          pagination: {
            pageNum,
            pageSize,
            total
          },
          finished
        })
      }).catch(res => {
        console.error(res)
      })
    }, 500)
  },
  // 文件点击事件处理
  onFileClick(event) {
    const file = event.detail.file
    console.log(file)
    const {
      id,
      fileType,
      fileName
    } = file
    switch(fileType) {
      case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_DIR:  // 文件夹
        wx.navigateTo({
          url: '/pages/fileList/fileList'
        })
        // this.setData({
        //   'filters.parentId': id,
        //   'pagination.pageNum': 1,
        //   fileList: []
        // })
        // wx.setNavigationBarTitle({
        //   title: fileName
        // })
        // this.getFileList()
        break
      case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_PIC: // 图片
        console.log('pic')
        wx.previewImage({
          urls: [
            file.thumbnailUrl
          ]
        })
        break
    }
  },
  // // 获取节点信息
  // $uGetRect(selector, all) {
  //   return new Promise(resolve => {
  //     wx.createSelectorQuery().
  //     in(this)[all ? 'selectAll' : 'select'](selector)
  //       .boundingClientRect(rect => {
  //         if (all && Array.isArray(rect) && rect.length) {
  //           resolve(rect)
  //         }
  //         if (!all && rect) {
  //           resolve(rect)
  //         }
  //       })
  //       .exec()
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFileList()
    wx.getSystemInfo({
      success: info => {
        console.log(info)
        const {
          windowHeight,
          windowWidth,
        } = info
        this.setData({
          windowHeight,
          windowWidth
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  // 触底
  onReachBottom() {
    if(this.data.finished) {
      return
    }
    this.setData({
      'pagination.pageNum': this.data.pagination.pageNum + 1
    })
    this.getFileList()
  },
  onTabClick(e) {
    const tab = e.detail.tab
    this.setData({
      active: tab.value
    })
  }
})