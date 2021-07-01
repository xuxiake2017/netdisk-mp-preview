import fileListBehaviors from '../../common/behaviors/fileListBehaviors';
import commonBehaviors from '../../common/behaviors/commonBehaviors';
import { behavior as computedBehavior } from 'miniprogram-computed';
import { styleObj2StyleStr } from '../../utils/util';

Component({
  behaviors: [
    fileListBehaviors,
    commonBehaviors,
    computedBehavior
  ],

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示搜索历史
    showSearchHistory: true,
    // 搜素内容
    searchContent: '',
    // 搜索历史列表
    searchHistoryList: [],
    // 导航栏高度（包含状态栏）
    navHeight: 88,
    // 搜索结果条数
    searchResult: 0,
  },

  computed: { // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
    // header样式
    headerStyle: data => {
      const styleObj = {
        top: `${data.navHeight}px`,
        height: data.showSearchHistory ? '140rpx' : '230rpx'
      }
      return styleObj2StyleStr(styleObj)
    },
    // header wrap样式
    headerWrapStyle: data => {
      const styleObj = {
        height: data.showSearchHistory ? '140rpx' : '230rpx'
      }
      return styleObj2StyleStr(styleObj)
    }
  },

  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getHistoryList()
    },
  
    onReady () {
      this.$uGetRect('.custom-nav').then((result) => {
        this.setData({
          navHeight: result.height
        })
      })
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if(this.data.finished) {
        return
      }
      this.setData({
        'pagination.pageNum': this.data.pagination.pageNum + 1
      })
      this.getFileList()
    },
  
  
    // 输入框点击处理
    onInputClick () {
      this.setData({
        showSearchHistory: true
      })
    },
    // 搜素历史点击
    onHistoryItemClick (e) {
      this.setData({
        searchContent: e.target.dataset.item
      })
      this.onSearch()
    },
    // 处理搜索请求
    async onSearch () {
      if (!this.data.searchContent) {
        wx.navigateBack()
        return
      }
      this.setData({
        'filters.fileRealName': this.data.searchContent,
        showSearchHistory: false
      })
      this.setHistoryList(this.data.searchContent)
      const res = await this.resetFileList()
      this.setData({
        searchResult: res.data.pageInfo.total
      })
    },
    // 获取搜索列表
    getHistoryList () {
      wx.getStorage({
        key: 'SEARCH_HISTORY_LIST',
        success: ({ data }) => {
          let searchHistoryList = []
          if (data) {
            searchHistoryList = JSON.parse(data)
            this.setData({
              searchHistoryList
            })
          }
        }
      })
    },
    // 设置搜索列表
    setHistoryList (searchKwd) {
      let searchHistoryList = this.data.searchHistoryList
      // 已存在的搜索记录不保存
      if (searchHistoryList.indexOf(searchKwd) === -1 || searchHistoryList.length === 0) {
        // 最多保存10条搜索历史
        if (searchHistoryList.length > 10) {
          searchHistoryList = searchHistoryList.slice(1, searchHistoryList.length)
        }
        searchHistoryList.push(searchKwd)
        this.setData({
          searchHistoryList
        })
        const searchHistoryListStr = JSON.stringify(searchHistoryList)
        wx.setStorage({
          key: 'SEARCH_HISTORY_LIST',
          data: searchHistoryListStr
        })
      }
    },
    // 清除搜索列表
    clearHistoryList () {
      this.$showModal('提示', '确认清除搜索历史？').then((result) => {
        this.setData({
          searchHistoryList: []
        })
        wx.setStorage({
          key: 'SEARCH_HISTORY_LIST',
          data: ''
        })
      })
    },
    // 清空输入（搜索框内容）
    onClearInput () {
      this.setData({
        searchContent: '',
        showSearchHistory: true
      })
    },
  }

})