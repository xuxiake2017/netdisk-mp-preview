// 小程序官方的计算属性插件
import { behavior as computedBehavior } from 'miniprogram-computed';
import fileListBehaviors from '../../common/behaviors/fileListBehaviors';
import { MOVE_FILE_SUCCESS } from '../../common/events';
const app = getApp()

Component({ // 使用 Component 构造器构造页面

  // 混入（相当于vue的mixins）
  behaviors: [
    fileListBehaviors,
    computedBehavior,
  ],

  properties: {
    fileId: Number,
  },
  /**
   * 页面的初始数据
   */
  data: {
    parentId: null,
    pathname: ''
  },
  // 计算属性
  computed: {
  },

  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      this.setData({
        'filters.parentId': this.data.fileId
      })
      this.getFileList()
      app.emitter.on(MOVE_FILE_SUCCESS, () => {
        const moveOptFile = app.globalData.moveOptFile
        if (moveOptFile.parentId === this.data.fileId)
        this.resetFileList()
      })
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
  }
})