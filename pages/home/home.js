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
    // 加载中
    loading: false,
    // 加载结束
    finished: false,
    optFile: {
      fileName: ''
    }
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
  fileOptHandler(event) {
    const optFile = event.detail.file
    this.setData({
      show: true,
      optFile
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
        this.setData({
          loading: false,
          finished: true
        })
      })
    }, 500)
  },
  // 文件点击事件处理
  onFileClick(event) {
    const file = event.detail.file
    const {
      id,
      fileType,
      fileName
    } = file
    switch(fileType) {
      case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_DIR:  // 文件夹
        wx.navigateTo({
          url: `/pages/fileList/fileList?fileId=${id}`
        })
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
  },
  onOptClick (e) {
    const opt = e.detail.opt
    console.log('onOptClick', opt)
  }
})