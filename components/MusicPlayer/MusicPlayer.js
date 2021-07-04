import { behavior as computedBehavior } from 'miniprogram-computed';
import { styleObj2StyleStr, formateSecond, throttle } from '../../utils/util';
import colorThief from "miniapp-color-thief";
import commonBehaviors from '../../common/behaviors/commonBehaviors';

Component({

  behaviors: [
    computedBehavior,
    commonBehaviors,
  ],
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  /**
   * 组件的属性列表
   */
  properties: {
    autoplay: {
      type: Boolean,
      value: true,
    },
    // 循环模式 sequence single random?
    loopMode: {
      type: String,
      value: 'sequence',
    },
    volume: {
      type: Number,
      value: 10,
    },
    audio: {
      type: Array,
      value: []
    },
    playIndex: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _audioContext: null,
    mainColor: '#FFF',
    showVolumeProgress: false,
    currentTime: 0,
    duration: 0,
    _playProgressChanging: false,
    paused: true,
    volumeCurrent: 10,
    _defaultCover: 'https://read-1252195440.cos.ap-guangzhou.myqcloud.com/_defaultCover.jpg',
    windowWidth: 0,
    currentIndex: 0,
    canvas: undefined,
    ctx: undefined,
    canvasWidth: 0,
    canvasHeight: 0,
    loopModeCurrent: 'sequence',
    _randomList: []
  },

  computed: {
    contentStyle: data => {
      const styleObj = {
        background: `linear-gradient(to right bottom, ${data.mainColor}, #B0B0B0)`,
      }
      return styleObj2StyleStr(styleObj)
    },
    currentTimeFormat: data => {
      return formateSecond(data.currentTime)
    },
    durationFormat: data => {
      return formateSecond(data.duration)
    },
    commonWidth: data => {
      const styleObj = {
        width: `${data.windowWidth}px`,
      }
      return styleObj2StyleStr(styleObj)
    },
    commonHeight: data => {
      const styleObj = {
        height: `${data.windowWidth}px`,
      }
      return styleObj2StyleStr(styleObj)
    },
    currentAudio: data => {
      return data.audio[data.currentIndex]
    },
    loopIcon: data => {
      switch (data.loopModeCurrent) {
        case 'sequence':
          return 'icon-liebiaoxunhuan'
        case 'single':
          return 'icon-danquxunhuan'
        case 'random':
          return 'icon-suijibofang'
      }
    }
  },

  observers: {
    audio: function (val) {
      if (val.length > 0) {
        if (this.data.currentIndex > val.length - 1) {
          this.setData({
            currentIndex: 0
          })
        }
        this.createAudioCtx()
        this.drawImage()
      }
    }
  },

  lifetimes: {
    attached () {
      const windowWidth = wx.getSystemInfoSync().windowWidth
      if (this.data.loopMode === 'random') {
        this.setData({
          volumeCurrent: this.data.volume,
          currentIndex: this.data.playIndex,
          loopModeCurrent: this.data.loopMode,
          windowWidth,
          _randomList: [
            this.data.playIndex
          ]
        })
      } else {
        this.setData({
          volumeCurrent: this.data.volume,
          currentIndex: this.data.playIndex,
          loopModeCurrent: this.data.loopMode,
          windowWidth,
        })
      }
    },
    detached () {
      if (this.data._audioContext) {
        this.data._audioContext.destroy()
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    _drawImage (canvas, ctx, width, height) {
      const image = canvas.createImage();
      const currentAudio = this.data.audio[this.data.currentIndex]
      if (currentAudio.cover) {
        image.src = currentAudio.cover
      } else {
        image.src = this.data._defaultCover
      }
      image.onload = () => {
        const imageWidth = image.width
        const imageHeight = image.height
        let sWidth = 0
        let sHeight = 0
        let sx = 0
        let sy = 0
        if (imageWidth >= imageHeight) {
          sWidth = imageHeight
          sHeight = imageHeight
          sx = (imageWidth - imageHeight) / 2
        } else {
          sWidth = imageWidth
          sHeight = imageWidth
          sy = (imageHeight - imageWidth) / 2
        }
        ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height)
        const palette = colorThief(imageData.data).color().getHex();
        this.setData({
          mainColor: palette
        })
      }
    },
    drawImage () {
      if (this.data.canvas && this.data.ctx) {
        const canvas = this.data.canvas
        const ctx = this.data.ctx
        const width = this.data.canvasWidth
        const height = this.data.canvasHeight

        ctx.clearRect(0, 0, width, height)

        this._drawImage(canvas, ctx, width, height)
      } else {
        const query = wx.createSelectorQuery().in(this)
        query.select('#canvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const width = res[0].width
            const height = res[0].height
            this.setData({
              canvas,
              ctx,
              canvasWidth: width,
              canvasHeight: height,
            })
  
            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.scale(dpr, dpr)
  
            this._drawImage(canvas, ctx, width, height)
          })
      }
    },

    createAudioCtx () {
      const innerAudioContext = wx.createInnerAudioContext()
      this.setData({
        _audioContext: innerAudioContext
      })
      innerAudioContext.autoplay = this.data.autoplay

      const currentAudio = this.data.audio[this.data.currentIndex]
      wx.setNavigationBarTitle({
        title: currentAudio.name
      })
      if (!currentAudio.url) {
        this.$toast('转码未完成，请稍后重试')
      }

      innerAudioContext.src = currentAudio.url
      innerAudioContext.onPlay(() => {
        this.setData({
          paused: false
        })
        console.log('开始播放')
      })
      innerAudioContext.onPause(() => {
        this.setData({
          paused: true
        })
        console.log('暂停播放')
      })
      // 定位完成
      innerAudioContext.onSeeked(() => {
        innerAudioContext.play()
      })
      // 播放结束
      innerAudioContext.onEnded(() => {
        this.playNext()
      })
      // 播放进度改变
      innerAudioContext.onTimeUpdate(() => {
        throttle(() => {
          let { currentTime, duration } = innerAudioContext
          if (!this.data._playProgressChanging) {
            this.setData({
              currentTime: Number.parseInt(currentTime)
            })
            if (!this.data.duration) {
              this.setData({
                duration: Number.parseInt(duration)
              })
            }
          }
        }, 500)
      })
    },
    // 音量点击
    onVolumeClick () {
      this.setData({
        showVolumeProgress: !this.data.showVolumeProgress
      })
    },
    // 暂停点击
    onPauseClick () {
      if (this.data.paused) {
        this.data._audioContext.play()
      } else {
        this.data._audioContext.pause()
      }
    },
    // 播放进度条拖动结束
    onPlayProgressChange (event) {
      this.setData({
        _playProgressChanging: false
      })
      const { value } = event.detail
      this.data._audioContext.pause()
      this.data._audioContext.seek(value)
    },
    // 播放进度条拖动
    onPlayProgressChanging (event) {
      this.setData({
        _playProgressChanging: true
      })
    },
    // 音量改变
    onVolumeChange (event) {
      const { value } = event.detail
      this.setData({
        volumeCurrent: value
      })
      this.data._audioContext.volume = value / 10
    },
    // 下一曲
    playNext () {
      switch (this.data.loopModeCurrent) {
        case 'sequence':
          if (this.data.currentIndex > 0) {
            this.setData({
              currentIndex: this.data.currentIndex - 1
            })
          } else {
            this.setData({
              currentIndex: this.data.audio.length - 1
            })
          }
          break
        case 'single':
          break
        case 'random':
          if (this.data._randomList.length === this.data.audio.length) {
            this.setData({
              _randomList: [],
            })
          }
          const index = this._calcIndex()
          this.setData({
            currentIndex: index
          })
          break
      }
      this.setData({
        duration: 0
      })
      this.drawImage()
      this.data._audioContext.destroy()
      this.createAudioCtx()
    },
    // 上一曲
    playLast () {
      switch (this.data.loopModeCurrent) {
        case 'sequence':
          if (this.data.currentIndex > 0) {
            this.setData({
              currentIndex: this.data.currentIndex - 1
            })
          } else {
            this.setData({
              currentIndex: this.data.audio.length - 1
            })
          }
          break
        case 'single':
          break
        case 'random':
          if (this.data._randomList.length > 1) {
            this.data._randomList.pop()
            this.setData({
              _randomList: this.data._randomList,
              currentIndex: this.data._randomList[this.data._randomList.length - 1]
            })
          }
          break
      }
      this.setData({
        duration: 0
      })
      this.drawImage()
      this.data._audioContext.destroy()
      this.createAudioCtx()
    },
    // 计算索引
    _calcIndex () {
      const index = Number.parseInt(Math.random() * this.data.audio.length)
      if (this.data._randomList.includes(index) || index === this.data.currentIndex) {
        return this._calcIndex()
      } else {
        this.data._randomList.push(index)
        this.setData({
          _randomList: this.data._randomList
        })
        return index
      }
    },
    // 循环模式改变
    onLoopModeChange () {
      switch (this.data.loopModeCurrent) {
        case 'sequence':
          this.setData({
            loopModeCurrent: 'single',
            _randomList: []
          })
          this.$toast('单曲循环')
          break
        case 'single':
          this.setData({
            loopModeCurrent: 'random',
            _randomList: [
              this.data.currentIndex
            ]
          })
          this.$toast('随机播放')
          break
        case 'random':
          this.setData({
            loopModeCurrent: 'sequence',
            _randomList: []
          })
          this.$toast('列表循环')
          break
      }
    }
  }
})
