const fileList = require('../../utils/mock/fileList.js')
import { GetFileList } from '../../api/file'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    tabs: [
      {
        label: '网盘文件',
        value: 1
      },
      {
        label: '标签 2',
        value: 2
      },
      {
        label: '标签 3',
        value: 3
      }
    ],
    activeNames: ['1'],
    fileList: [],
    // 分页参数
    pagination: {
      total: 0,
      pageNum: 1,
      pageSize: 20
    },
    show: false,
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
    loading: false
  },
  onChange(event) {
    this.setData({
      active: event.detail.name
    })
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  onCollapseChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  fileOptHandler() {
    this.setData({
      show: true
    })
  },
  onPopupClose() {
    this.setData({
      show: false
    })
  },
  getFileList() {
    this.setData({
      loading: true
    })
    setTimeout(() => {
      GetFileList({}).then(res => {
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
        this.setData({
          fileList: list,
          pagination: {
            pageNum,
            pageSize,
            total
          }
        })
      }).catch(res => {
        console.error(res)
      })
    }, 500)
  },
  onFileClick(event) {
    const file = event.currentTarget.dataset.file
    const {
      fileType
    } = file
    switch(fileType) {
      case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_DIR:
        break
      case getApp().globalData.FILE_TYPE.FILE_TYPE_OF_PIC:
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})