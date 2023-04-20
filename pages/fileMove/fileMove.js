// 小程序官方的计算属性插件
import { behavior as computedBehavior } from 'miniprogram-computed';
import commonBehaviors from '../../common/behaviors/commonBehaviors';
import {
  ListAllDir,
  MoveFile,
  MkDir,
} from '../../api/file';
import { styleObj2StyleStr } from '../../utils/util';
import { MOVE_FILE_SUCCESS } from '../../common/events';
import { verifyFileName } from '../../utils/validate';
const app = getApp()

Component({ // 使用 Component 构造器构造页面

  // 混入（相当于vue的mixins）
  behaviors: [
    computedBehavior,
    commonBehaviors,
  ],
  /**
   * 页面的属性列表
   */
  properties: {
    parentId: {
      type: Number,
      value: -1
    },
    currentDirName: {
      type: String,
      value: '根目录/'
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    dirList: [],
    // 加载中
    loading: true,
    navHeight: 88,
    dialogShow: false,
    fileName: '',
  },

  computed: { // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
    showEmpty: data => {
      return !data.loading && data.dirList.length === 0
    },
    headerStyle: data => {
      const styleObj = {
        top: `${data.navHeight}px`
      }
      return styleObj2StyleStr(styleObj)
    }
  },

  /**
   * 页面的方法列表
   */
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
      this.ListAllDirWrap()
    },
    onReady: function () {
      this.$uGetRect('.custom-nav').then((result) => {
        this.setData({
          navHeight: result.height
        })
      })
    },

    ListAllDirWrap () {
      const params = {
        parentId: this.data.parentId
      }
      this.setData({
        loading: true,
        dirList: []
      })
      ListAllDir(params).then((result) => {
        this.setData({
          dirList: result.data,
          loading: false
        })
      }).catch((err) => {
        this.setData({
          loading: true
        })
      });
    },
    onFileClick (e) {
      const moveOptFile = app.globalData.moveOptFile
      const {
        id: parentId,
        fileName: currentDirName,
      } = e.detail.file
      if (moveOptFile.id === parentId) {
        this.$toast('不能移动到自身及其子目录！')
        return
      }
      wx.navigateTo({
        url: `/pages/fileMove/fileMove?parentId=${parentId}&currentDirName=${currentDirName}`
      })
    },
    goBack () {
      const currentPages = getCurrentPages()
      const delta = currentPages.filter(page => page.route === 'pages/fileMove/fileMove').length
      wx.navigateBack({
        delta
      })
    },
    // 确定移动
    moveConfirm () {
      const moveOptFile = app.globalData.moveOptFile
      const params = {
        parentId: this.data.parentId,
        key: moveOptFile.key
      }
      MoveFile(params).then((result) => {
        this.$toast.success('移动成功！')
        this.$emit(MOVE_FILE_SUCCESS, this.data.parentId)
        setTimeout(() => {
          this.goBack()
        }, 500)
      }).catch((err) => {
        this.$toast(err.msg || '移动失败！')
      });
    },
    openDialog () {
      this.setData({
        dialogShow: true,
      })
    },
    // 对话框点击确认
    onDialogConfirm () {
      this.makeDirHandler()
    },
    // 对话框点击取消
    onDialogCancel () {
      this.setData({
        dialogShow: false,
        fileName: ''
      })
    },
    // 对话框关闭（点击遮罩层触发）
    onDialogClose () {
    },
    clearInput () {
      this.setData({
        fileName: ''
      })
    },
    // 新建文件夹操作
    makeDirHandler () {
      try {
        verifyFileName(this.data.fileName)
        const params = {
          parentId: this.data.parentId,
          fileName: this.data.fileName,
        }
        MkDir(params).then(res => {
          this.$toast.success('新建文件夹成功！')
          this.setData({
            dialogShow: false,
          })
          this.ListAllDirWrap()
        }).catch(res => {
          this.$toast(res.msg || '新建文件夹失败！')
        })
      } catch (error) {
        console.log(error.message);
        this.$toast(error.message)
      }
    },
  }
})
