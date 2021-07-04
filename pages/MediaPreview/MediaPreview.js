import { GetFileMediaInfo } from '../../api/file';

Component({

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
        this.setData({
          audio: [
            {
              name: data.fileName,
              artist: data.fileMedia.musicArtist,
              url: data.fileOrigin.previewUrl,
              cover: data.fileMedia.musicPoster
            },
            {
              name: 'G.E.M._邓紫棋_-_光年之外[1].mp3',
              artist: 'G.E.M. 邓紫棋',
              url: 'https://netdisk.xikcloud.com/group1/M00/00/00/wKgACl8dGkyAbySNADmC6jsjHoQ460.mp3',
              cover: null
            },
            {
              name: '我们终究会牵手旅行_许飞[1].mp3',
              artist: '许飞',
              url: 'https://netdisk.xikcloud.com/group1/M00/00/00/wKgACl8dG1aAD-kyAExLI7mLOLI264.mp3',
              cover: null
            },
            {
              name: '(08) [鷺巣詩郎] 2EM09_YAMASHITA.mp3',
              artist: '鷺巣詩郎',
              url: 'https://netdisk.xikcloud.com/group1/M00/00/01/wKgACmA1AoyATn5FABPDv84PiEI356.mp3',
              cover: 'https://netdisk.xikcloud.com/group1/M00/00/02/wKgACmDHLTWAZz3SAAKvaccJmG4731_big.jpg'
            },
            {
              name: '王菲 - 你在终点等我.mp3',
              artist: '王菲',
              url: 'https://netdisk.xikcloud.com/group1/M00/00/02/wKgACmDgOAKADQHhAEWxd0MyQNs750.mp3',
              cover: 'https://netdisk.xikcloud.com/group1/M00/00/02/wKgACmDgN_uAXNn3AAJtozlZgVo776.jpg'
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