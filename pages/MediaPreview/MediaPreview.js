import { GetFileMediaInfo } from '../../api/file';
import commonBehaviors from '../../common/behaviors/commonBehaviors';

Component({

  behaviors: [
    commonBehaviors
  ],
  properties: {
    fileKey: {
      type: String,
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    audio: [],
  },

  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      GetFileMediaInfo({ fileKey: this.data.fileKey }).then(res => {
        const { data } = res
        if (!data.fileMedia) {
          this.$toast('暂不支持该文件预览！')
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
          return
        }
        this.setData({
          audio: [
            {
              name: data.fileName,
              artist: data.fileMedia.musicArtist,
              url: data.fileOrigin.previewUrl,
              cover: data.fileMedia.musicPoster
            },
          ]
        })
      })
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
  
    },
  }

})