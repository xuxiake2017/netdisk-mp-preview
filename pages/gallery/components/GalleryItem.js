import { behavior as computedBehavior } from 'miniprogram-computed';
import commonBehaviors from '../../../common/behaviors/commonBehaviors';
import { styleObj2StyleStr } from '../../../utils/util';
import timeFormat, { timeFormatHuman } from '../../../utils/timeFormat';

Component({

  behaviors: [
    computedBehavior,
    commonBehaviors,
  ],
  options: {
    // 组件样式隔离 apply-shared 表示页面 wxss 样式将影响到自定义组件
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    imgObj: {
      type: Object
    },
    windowWidth: {
      type: Number,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgWidth: 0,
    imgList: [],
    imgDate: ''
  },
  computed: {
    imgStyle: data => {
      const styleObj = {
        width: `${data.imgWidth}px`,
        height: `${data.imgWidth}px`,
      }
      return styleObj2StyleStr(styleObj)
    }
  },

  observers: {
    'windowWidth': function(windowWidth) {
      const imgWidth = (windowWidth - 2 * this.rpx2px(20) - 2 * 3) / 3
      this.setData({
        imgWidth
      })
    },
    'imgObj': function (imgObj) {
      const keys = Object.keys(imgObj)
      this.setData({
        imgList: imgObj[keys[0]],
        imgDate: timeFormatHuman(keys[0])
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    rpx2px (val) {
      return (this.data.windowWidth / 750) * val
    },
    onImgClick (e) {
      const img = e.target.dataset.img
      this.$emit('imgclick', { key: img.key })
    }
  }
})
