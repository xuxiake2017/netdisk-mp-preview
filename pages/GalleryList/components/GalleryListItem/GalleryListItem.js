import { ComponentWithComputed } from 'miniprogram-computed';

ComponentWithComputed({
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    galleryData: {
      type: Object,
      value: {},
    },
    showOptMenu: {
      type: Boolean,
      value: false,
    },
    isAllImgGallery: {
      type: Boolean,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  computed: {
    fileList: data => data.galleryData.fileList,
    checked: data => data.galleryData.checked,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLongpress (e) {
      if (this.data.isAllImgGallery) return
      this.triggerEvent('custom-longpress', this.data.galleryData)
    },
    onChecked () {
      if (this.data.isAllImgGallery) return
      this.triggerEvent('checked', {
        parentId: this.data.galleryData.parentId,
        checked: !this.data.checked,
      })
    },
    onClick () {
      const {
        parentId,
        galleryName,
      } = this.data.galleryData
      wx.navigateTo({
        url: `/pages/gallery/gallery?parentId=${parentId}&galleryName=${galleryName}`
      })
    }
  }
})
