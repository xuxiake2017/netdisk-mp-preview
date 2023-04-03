import {
  GetInfo,
  GetDetail,
  Logout
} from '../../api/user';
import { USER_STATUS_MAP } from '../../common/constant';
import commonBehaviors from '../../common/behaviors/commonBehaviors';
import create from 'mini-stores'
import GlobalStore from '../../stores/GlobalStore'

const stores = {
  '$data': GlobalStore,
}

create.Component(stores, {

  behaviors: [
    commonBehaviors
  ],
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    USER_STATUS_MAP,
    loading: false,
    refresherTriggered: false,
  },
  lifetimes: {
    attached () {
      this.GetDetailWrap()
    }
  },
  methods: {
    async GetDetailWrap () {
      this.setData({
        loading: true
      })
      try {
        const result = await GetDetail()
        this.setData({
          userInfo: result.data,
          loading: false
        })
      } catch (error) {
        this.setData({
          loading: false
        })
      }
    },
    onLogout () {
      this.$showModal('提示', '确认切换账号？').then((result) => {
        Logout().then((result) => {
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/user/login',
              success () {
                GlobalStore.data.isAuth = false
                GlobalStore.update()
              }
            })
          }, 500)
        }).catch((err) => {
          this.$toast('账号切换失败！')
        });
      })
    },
    goToUserInfo () {
      wx.navigateTo({
        url: '/pages/UserInfo/UserInfo'
      })
    },
    async onRefresherRefresh () {
      if(this.data.loading) {
        return
      }
      this.setData({
        refresherTriggered: true,
      })
      await this.GetDetailWrap()
      this.setData({
        refresherTriggered: false,
      })
    }
  }
})