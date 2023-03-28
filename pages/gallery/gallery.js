import { behavior as computedBehavior } from 'miniprogram-computed';
import create from 'mini-stores'

import { GetImgList } from '../../api/img';
import GlobalStore from '../../stores/GlobalStore'
import { device } from '../../conf/index'

const stores = {
  '$data': GlobalStore,
}

create.Component(stores, {
  behaviors: [
    computedBehavior,
  ],
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },
  /**
   * 页面的初始数据
   */
  data: {
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
    allImgs: [],
    refresherTriggered: false,
  },
  lifetimes: {
    attached () {
      this.GetImgListWrap()
      this.setData({
        windowWidth: device.windowWidth
      })
    }
  },
  methods: {
    // 触底
    onScrollToLower () {
      if(this.data.finished) {
        return
      }
      this.setData({
        'pagination.pageNum': this.data.pagination.pageNum + 1
      })
      this.GetImgListWrap()
    },
    // 监听用户下拉刷新事件
    async onRefresherRefresh () {
      this.setData({
        refresherTriggered: true,
      })
      await this.resetImgList()
      this.setData({
        refresherTriggered: false,
      })
    },
    async resetImgList () {
      this.setData({
        'pagination.pageNum': 1,
        imgList: [],
      })
      await this.GetImgListWrap()
    },
    async GetImgListWrap () {
      const params = {
        ...this.data.pagination
      }
      this.setData({
        loading: true
      })
      try {
        const result = await GetImgList(params)
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
      } catch (error) {
        this.setData({
          loading: false,
          finished: true
        })
      }
    },
    onImgClick (e) {
      const fileKey = e.detail.key
      const current = this.data.allImgs.find(item => item.key === fileKey).fileOrigin.previewUrl
      const urls = this.data.allImgs.map(item => item.fileOrigin.previewUrl)
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls, // 需要预览的图片http链接列表
        showmenu: true
      })
    }
  }
})