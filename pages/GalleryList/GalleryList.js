import { behavior as computedBehavior } from 'miniprogram-computed';
import create from 'mini-stores'

import GlobalStore from '../../stores/GlobalStore'
import GalleryStore from '../../stores/GalleryStore'
import { getGalleryList, getGalleryNum } from '../../api/img'

const stores = {
  '$data': GlobalStore,
  '$gallery': GalleryStore,
}

create.Component(stores, {
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },
  behaviors: [
    computedBehavior,
  ],
  data: {
    refresherTriggered: false,
    loading: false,
  },
  lifetimes: {
    async attached () {
      this.setData({
        loading: true
      })
      await GalleryStore.getGalleryList()
      this.setData({
        loading: false
      })
    },
    detached () {
      GalleryStore.data.allImgGallery = []
      GalleryStore.setGalleryList([])
    }
  },
  computed: {
    showEmpty: data => !data.loading && data.$gallery.allImgGallery.length && data.$gallery.galleryList.length === 0
  },
  methods: {
    async onRefresherRefresh () {
      if (this.loading) {
        return
      }
      this.setData({
        refresherTriggered: true,
      })
      await GalleryStore.getGalleryList()
      this.setData({
        refresherTriggered: false,
      })
    },
    onLongpress (e) {
      if (this.data.$gallery.showOptMenu) return
      const index = e.target.dataset.index
      const galleryList = GalleryStore.data.galleryList
      galleryList[index] = {
        ...galleryList[index],
        checked: true,
      }
      GalleryStore.data.showOptMenu = true
      GalleryStore.setGalleryList(galleryList)
    },
    onChecked (e) {
      const index = e.target.dataset.index
      const {
        checked,
        parentId
      } = e.detail
      const galleryList = GalleryStore.data.galleryList
      galleryList[index] = {
        ...galleryList[index],
        checked,
      }
      GalleryStore.setGalleryList(galleryList)
    },
    onUploadFile () {
      GlobalStore.setActiveTab('home')
    }
  }
})