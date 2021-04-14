// 小程序官方的计算属性插件
import { behavior as computedBehavior } from 'miniprogram-computed';
import fileListBehaviors from '../../common/behaviors/fileListBehaviors';

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
    // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
    showEmpty: data => {
      return !data.loading && data.fileList.length === 0
    },
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