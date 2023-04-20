import fileListBehaviors from '../../common/behaviors/fileListBehaviors';
import { AUTO_LOGIN_COMPLATE, MOVE_FILE_SUCCESS } from '../../common/events';
import create from 'mini-stores'
import GlobalStore from '../../stores/GlobalStore'

const stores = {
  '$data': GlobalStore,
}

const app = getApp()
create.Component(stores, {
  // 混入（相当于vue的mixins）
  behaviors: [
    fileListBehaviors,
  ],
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },
  /**
   * 页面的初始数据
   */
  data: {
    // 排序方式索引
    orderByIndex: 0,
    // 排序方式列表
    orderByList: [
      {
        value: 'fileName',
        label: '文件名',
      },
      {
        value: 'uploadTime',
        label: '上传时间',
      },
    ],
    refresherTriggered: true,
  },
  methods: {
    onSearchInputClick () {
      wx.navigateTo({
        url: `/pages/searchPage/searchPage`
      })
    },
    // 排序方式改变处理
    async onOrderByChange (e) {
      const orderByIndex = Number(e.detail.value)
      this.setData({
        orderByIndex,
      })
      await app.setOrderBy(this.data.orderByList[orderByIndex].value)
      this.resetFileList()
    },
    setOrderByIndex () {
      const orderBy = app.globalData.orderBy
      const index = this.data.orderByList.findIndex(item => item.value === orderBy)
      this.setData({
        orderByIndex: index,
      })
    },
    async onRefresherRefresh () {
      if(this.data.loading) {
        return
      }
      this.setData({
        refresherTriggered: true,
      })
      await this.resetFileList()
      this.setData({
        refresherTriggered: false,
      })
    },
    onScrollToLower () {
      if(this.data.finished || this.data.loading) {
        return
      }
      this.setData({
        'pagination.pageNum': this.data.pagination.pageNum + 1
      })
      this.getFileList()
    },
  },

  lifetimes: {
    attached () {
      if (app.globalData.inited) {
        this.setOrderByIndex()
        this.getFileList()
      }
      app.emitter.once(AUTO_LOGIN_COMPLATE, () => {
        this.setOrderByIndex()
        this.getFileList()
      })
      app.emitter.on(MOVE_FILE_SUCCESS, (parentId) => {
        const moveOptFile = app.globalData.moveOptFile
        if (moveOptFile.parentId === -1 || parentId === -1)
        this.resetFileList()
      })
    }
  },
  
})