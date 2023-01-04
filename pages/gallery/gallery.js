import { GetImgList } from '../../api/img';
import create from 'mini-stores'
import GlobalStore from '../../stores/GlobalStore'

const stores = {
  '$data': GlobalStore,
}

create.Page(stores, {

  /**
   * 页面的初始数据
   */
  data: {
    // 当前tab
    active: 'gallery',
    // tabs
    tabs: [
      {
        label: '相册文件',
        value: 'home'
      },
      {
        label: '我的相册',
        value: 'gallery'
      },
      {
        label: '个人中心',
        value: 'user'
      }
    ],
    // 图片列表
    imgList: [],
    // 分页参数
    pagination: {
      total: 0,
      pageNum: 1,
      pageSize: 20
    },
    // 加载中
    loading: true,
    // 加载结束
    finished: false,
    windowWidth: 375,
    allImgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetImgListWrap()
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 触底
  onReachBottom () {
    if(this.data.finished) {
      return
    }
    this.setData({
      'pagination.pageNum': this.data.pagination.pageNum + 1
    })
    this.GetImgListWrap()
  },
  // 监听用户下拉刷新事件
  onPullDownRefresh () {
    this.resetImgList()
  },

  onTabClick(e) {
    const tab = e.detail.tab
    if (this.data.active === tab.value) return
    switch (tab.value) {
      case 'home':
        wx.switchTab({
          url: '/pages/home/home'
        })
        break
      case 'gallery':
        wx.switchTab({
          url: '/pages/gallery/gallery'
        })
        break
      case 'user':
        wx.switchTab({
          url: '/pages/user/user'
        })
        break
    }
  },
  resetImgList () {
    this.setData({
      'pagination.pageNum': 1,
      imgList: []
    })
    this.GetImgListWrap()
  },
  GetImgListWrap () {
    const params = {
      ...this.data.pagination
    }
    this.setData({
      loading: true
    })
    GetImgList(params).then((result) => {
      const {
        list,
        pageInfo: {
          pageNum,
          pageSize,
          total,
          list: list_
        }
      } = result.data
      let finished = false
      // 判断是否结束加载
      if(pageNum * pageSize >= total) {
        finished = true
      }
      this.setData({
        imgList: [...this.data.imgList, ...result.data.list],
        loading: false,
        finished,
        allImgs: this.data.allImgs.concat(list_)
      })
      wx.stopPullDownRefresh()
    }).catch((err) => {
      this.setData({
        loading: false,
        finished: true
      })
      wx.stopPullDownRefresh()
    });
  },
  onImgClick (e) {
    const fileKey = e.detail.key
    const current = this.data.allImgs.find(item => item.key === fileKey).fileOrigin.previewUrl
    const urls = this.data.allImgs.map(item => item.fileOrigin.previewUrl)
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  }
})