import { behavior as computedBehavior } from 'miniprogram-computed';
import create from 'mini-stores'
import GlobalStore from '../../stores/GlobalStore'

const stores = {
  '$data': GlobalStore,
}

create.Page(stores, {
  behaviors: [
    computedBehavior,
  ],
  data: {
  },
  computed: {
    swiperIndex: data => {
      return data.$data.tabs.findIndex(tab => tab.value === data.$data.activeTab)
    }
  },
  onShareAppMessage () {
    return {
      title: '使用「我的照片墙」小程序，立即备份本地照片',
      path: '/pages/IndexPage/IndexPage',
      imageUrl: '/static/onShareAppMessage_bg.jpg'
    }
  },

  onTabClick(e) {
    const tab = e.detail.tab
    if (this.data.$data.activeTab === tab.value) return
    GlobalStore.setActiveTab(tab.value)
  },
  onSwiperChange (e) {
    const {
      tabs
    } = this.data.$data
    GlobalStore.setActiveTab(tabs[e.detail.current].value)
  }
})