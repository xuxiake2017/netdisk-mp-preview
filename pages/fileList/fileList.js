// 小程序官方的计算属性插件
import computedBehavior from 'miniprogram-computed';
import fileListBehaviors from '../../common/behaviors/fileListBehaviors';
Page({

  // 混入（相当于vue的mixins）
  behaviors: [
    fileListBehaviors,
    computedBehavior,
  ],
  /**
   * 页面的初始数据
   */
  data: {
    parentId: null,
    pathname: ''
  },
  // 计算属性
  computed: {
    // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
    showEmpty: data => {
      if (!data.loading || data.fileList) {
        return false
      }
      return !data.loading && data.fileList.length === 0
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ fileId }) {
    this.setData({
      'filters.parentId': fileId
    })
    this.getFileList()
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
  goBack() {
    wx.navigateBack()
  },
})