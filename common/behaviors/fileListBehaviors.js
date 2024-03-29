import {
  GetFileList,
  ReName,
  GetFileMediaInfo,
  MkDir,
  CheckMd5,
  UploadMD5,
  fileUploadAction,
  DeleteFile,
  fileDownloadAction,
} from '../../api/file'
import { behavior as computedBehavior } from 'miniprogram-computed';
import commonBehaviors from './commonBehaviors';
import { verifyFileName } from '../../utils/validate';
import { getToken } from '../../conf/index';
import timeFormat from '../../utils/timeFormat';
import { isFileExist, mkDir } from '../../utils/wxFile';

const app = getApp()

const fileOptionsDir = [
  {
    name: '重命名',
    icon: 'icon-rename',
    value: 'rename'
  },
  {
    name: '删除',
    icon: 'icon-delete',
    value: 'delete'
  },
  {
    name: '移动',
    icon: 'icon-move',
    value: 'move'
  },
]
const fileOptionsFile = [
  ...fileOptionsDir,
  {
    name: '下载',
    icon: 'icon-xiazai',
    value: 'download'
  },
]
export default Behavior({
  behaviors: [
    computedBehavior,
    commonBehaviors,
  ],
  data: {
    // 文件列表
    fileList: [],
    // 分页参数
    pagination: {
      total: 0,
      pageNum: 1,
      pageSize: 20
    },
    // 查询过滤条件
    filters: {
      parentId: -1,
      fileRealName: ''
    },
    // 是否展示文件操作弹窗
    show: false,
    // 加载中
    loading: true,
    // 加载结束
    finished: false,
    optFile: {
      fileName: ''
    },
    optDialogShow: false,
    // dialog行为（重命名reName；新建文件夹makeDir）
    dialogAction: 'reName',
    fileName: '',
    uploadPopupShow: false,
    fileOptions: [],
  },
  computed: { // 注意： computed 函数中不能访问 this ，只有 data 对象可供访问
    // 对话框标题
    optDialogTitle: data => {
      switch (data.dialogAction) {
        case 'reName':
          return '重命名'
        case 'makeDir':
          return '新建文件夹'
      }
    },
    showEmpty: data => {
      return !data.loading && data.fileList.length === 0
    },
  },
  methods: {
    // 获取文件列表
    async getFileList() {
      this.setData({
        loading: true,
        finished: false,
      })
      const params = {
        ...this.data.pagination,
        ...this.data.filters,
        orderBy: app.globalData.orderBy
      }
      try {
        const res = await GetFileList(params)
        const data = res.data
        const {
          list,
          pageNum,
          pageSize,
          total
        } = data.pageInfo
        let finished = false
        // 判断是否结束加载
        if(pageNum * pageSize >= total) {
          finished = true
        }
        this.setData({
          fileList: [ ...this.data.fileList, ...list ],
          pagination: {
            pageNum,
            pageSize,
            total
          },
          finished
        })
        this.setData({
          loading: false
        })
        if (this.data.hasOwnProperty('pathname')) {
          this.setData({
            pathname: data.pathname
          })
        }
        return res
      } catch (error) {
        console.error(error)
        this.setData({
          loading: false,
          finished: true
        })
        return undefined
      }
    },
    resetFileList () {
      this.setData({
        'pagination.pageNum': 1,
        fileList: [],
      })
      return this.getFileList()
    },
    // 对文件进行操作
    fileOptHandler(event) {
      const optFile = event.detail.file
      this.setData({
        show: true,
        optFile,
        fileOptions: optFile.isDir === app.globalData.FILE_TYPE.FILE_TYPE_OF_DIR ?
          fileOptionsDir : fileOptionsFile
      })
    },
    // 文件操作对话框关闭
    onPopupClose() {
      this.setData({
        show: false
      })
    },
    // 文件操作项点击
    async onOptClick (e) {
      this.setData({
        show: false,
      })
      const opt = e.detail.opt
      switch (opt.value) {
        case 'rename':
          this.setData({
            dialogAction: 'reName',
            optDialogShow: true,
            fileName: this.data.optFile.fileName
          })
          break
        case 'delete':
          this.DeleteFileWrap()
          break
        case 'move':
          app.globalData.moveOptFile = this.data.optFile
          wx.navigateTo({
            url: '/pages/fileMove/fileMove'
          })
          break
        case 'download':
          this.downloadFileWrap()
          break
      }
    },
    openFile (filePath) {
      const {
        fileType
      } = this.data.optFile
      switch(fileType) {
        case app.globalData.FILE_TYPE.FILE_TYPE_OF_PIC: // 图片
          wx.previewImage({
            urls: [
              filePath
            ],
            showmenu: true,
          })
          break
        case app.globalData.FILE_TYPE.FILE_TYPE_OF_VIDEO: // 视频
          wx.previewMedia({
            sources: [
              {
                url: filePath,
                type: 'video',
              }
            ],
            showmenu: true,
          })
          break
        default:
          wx.openDocument({
            filePath,
            showMenu: true,
          })
      }
    },
    async downloadFileWrap () {
      const {
        filePath,
        fileName,
      } = this.data.optFile
      const filePathFull = `${wx.env.USER_DATA_PATH}/download${filePath}${fileName}`
      if (isFileExist(filePathFull)) {
        try {
          await this.$showModal('提示', '该文件已存在是否重新下载？')
          this.downloadFile()
        } catch (error) {
          this.openFile(filePathFull)
        }
      } else {
        this.downloadFile()
      }
    },
    async downloadFile () {
      this.$showLoading('下载中')
      const token = await getToken()
      const header = {
        'X-Token': token
      }
      const {
        filePath,
        fileName,
        key,
      } = this.data.optFile
      const filePathFull = `${wx.env.USER_DATA_PATH}/download${filePath}${fileName}`
      this.downloadTask = wx.downloadFile({
        url: `${fileDownloadAction}?fileKey=${key}`,
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            const fileManager = wx.getFileSystemManager()
            mkDir(`${wx.env.USER_DATA_PATH}/download${filePath}`)
            fileManager.saveFile({
              tempFilePath: res.tempFilePath,
              filePath: filePathFull,
              success: (res) => {
                this.$hideLoading()
                this.$toast.success('下载成功')
                this.openFile(filePathFull)
              },
              fail: err => {
                this.$hideLoading()
                this.$toast.error('下载失败')
              }
            })
          }
        },
      })
    },
    // 文件点击事件处理
    onFileClick (event) {
      const file = event.detail.file
      const {
        id,
        fileType,
        fileName,
        key: fileKey,
      } = file
      switch(fileType) {
        case app.globalData.FILE_TYPE.FILE_TYPE_OF_DIR:  // 文件夹
          wx.navigateTo({
            url: `/pages/fileList/fileList?fileId=${id}`
          })
          break
        case app.globalData.FILE_TYPE.FILE_TYPE_OF_PIC: // 图片
          console.log('pic')
          wx.previewImage({
            urls: [
              file.thumbnailUrl
            ],
            showmenu: true,
          })
          break
        case app.globalData.FILE_TYPE.FILE_TYPE_OF_VIDEO: // 视频
          console.log('video')
          GetFileMediaInfo({ fileKey }).then(res => {
            if (!res.data.fileMedia) {
              this.$toast('暂不支持该文件预览！')
              return
            }
            const previewUrl =  res.data.fileOrigin.previewUrl
            const poster =  res.data.fileMedia.thumbnailUrl
            wx.previewMedia({
              sources: [
                {
                  url: previewUrl,
                  type: 'video',
                  poster: poster
                }
              ],
              showmenu: true,
            })
          })
          break
        case app.globalData.FILE_TYPE.FILE_TYPE_OF_MUSIC: // 音频
          console.log('music')
          wx.navigateTo({
            url: `/pages/MediaPreview/MediaPreview?fileKey=${fileKey}`
          })
          break
      }
    },
    // 对话框点击确认
    onDialogConfirm () {
      switch (this.data.dialogAction) {
        case 'reName':
          this.reNameHandler()
          break
        case 'makeDir':
          this.makeDirHandler()
          break
      }
    },
    // 对话框点击取消
    onDialogCancel () {
      this.setData({
        optDialogShow: false,
        fileName: ''
      })
    },
    // 对话框关闭（点击遮罩层触发）
    onDialogClose () {
    },
    // 重命名操作
    reNameHandler () {
      try {
        verifyFileName(this.data.fileName)
        const params = {
          parentId: this.data.filters.parentId,
          key: this.data.optFile.key,
          fileName: this.data.fileName,
          isDir: this.data.optFile.isDir
        }
        ReName(params).then(res => {
          this.$toast.success('重命名成功！')
          this.setData({
            'pagination.pageNum': 1,
            fileList: [],
          })
          this.setData({
            optDialogShow: false
          })
          this.getFileList()
        }).catch(res => {
          this.$toast(res.msg || '重命名失败！')
        })
      } catch (error) {
        console.log(error.message);
        this.$toast(error.message)
      }
    },
    // 新建文件夹操作
    makeDirHandler () {
      try {
        verifyFileName(this.data.fileName)
        const params = {
          parentId: this.data.filters.parentId,
          fileName: this.data.fileName,
        }
        MkDir(params).then(res => {
          this.$toast.success('新建文件夹成功！')
          this.setData({
            'pagination.pageNum': 1,
            fileList: [],
          })
          this.setData({
            optDialogShow: false
          })
          this.getFileList()
        }).catch(res => {
          this.$toast(res.msg || '新建文件夹失败！')
        })
      } catch (error) {
        console.log(error.message);
        this.$toast(error.message)
      }
    },
    onUploadFile () {
      this.setData({
        uploadPopupShow: true
      })
    },
    onUploadPopupClose () {
      this.setData({
        uploadPopupShow: false
      })
    },
    /**
     * 检查文件MD5
     * @param {String} tempFilePath 文件临时路径
     * @param {String} fileRealName 文件名
     */
    async checkMd5Wrap (tempFilePath, fileRealName = '') {
      const {
        digest: md5Hex,
        size: fileSize,
      } = await new Promise((resolve, reject) => {
        wx.getFileInfo({
          filePath: tempFilePath,
          success: res => {
            resolve(res)
          }
        })
      })
      if (!fileRealName) {
        // 扩展名，包含.
        const extName = tempFilePath.substring(tempFilePath.lastIndexOf('.'), tempFilePath.length)
        const current = new Date()
        fileRealName = `${timeFormat(current.getTime(), 'yyyy-mm-dd_hhMMss')}_${md5Hex.substring(0, 4)}${extName}`
      }
      try {
        const checkMd5Result = await CheckMd5({ md5Hex })
        if (checkMd5Result.data === 20033) { // 不存在该MD5值
          const formData = {
            md5Hex,
            parentId: this.data.filters.parentId,
            lastModifiedDate: new Date().getTime(),
            fileRealName
          }
          const token = await getToken()
          const header = {
            'X-Token': token
          }
          await new Promise((resolve, reject) => {
            wx.uploadFile({
              url: fileUploadAction,
              filePath: tempFilePath,
              name: 'file',
              formData,
              header,
              success: res => {
                const result = JSON.parse(res.data)
                if (result.code === 20000) {
                  resolve()
                } else {
                  reject(result)
                }
              }
            })
          })
        } else if (checkMd5Result.data === 20034) { // 存在该MD5值
          const params = {
            md5Hex,
            fileSize,
            parentId: this.data.filters.parentId,
            fileRealName
          }
          await UploadMD5(params)
        }
        return true
      } catch (error) {
        console.log(error);
        this.$hideLoading()
        this.$toast(error.msg || error.message || '文件上传失败！')
        return false
      }
    },
    uploadImg () {
      wx.chooseImage({
        success: res => {
          const tempFilePaths = res.tempFilePaths
          const resset = []
          tempFilePaths.forEach(tempFilePath => {
            resset.push(this.checkMd5Wrap(tempFilePath))
          })
          this.$showLoading('上传中')
          Promise.all(resset).then((result) => {
            if (result.every(item => item)) {
              this.$hideLoading()
              this.$toast.success('上传成功！')
              this.resetFileList()
            }
          })
        }
      })
    },
    onUploadItemClick (e) {
      this.setData({
        uploadPopupShow: false
      })
      const type = e.detail.type
      switch (type) {
        case 'pic':
          this.uploadImg()
          break
        case 'video':
          wx.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            camera: 'back',
            success: res => {
              const tempFilePath = res.tempFilePath
              this.$showLoading('上传中')
              this.checkMd5Wrap(tempFilePath).then((result) => {
                if (result) {
                  this.$hideLoading()
                  this.$toast.success('上传成功！')
                  this.resetFileList()
                }
              })
            }
          })
          break
        case 'dir':
          this.setData({
            dialogAction: 'makeDir',
            optDialogShow: true,
          })
          break
        case 'wechat':
          wx.chooseMessageFile({
            count: 10,
            type: 'all',
            success: res => {
              const tempFilePaths = res.tempFiles
              if (tempFilePaths && tempFilePaths.length > 0) {
                const resset = []
                tempFilePaths.forEach(({
                  name,
                  path,
                  size,
                }) => {
                  resset.push(this.checkMd5Wrap(path, name))
                })
                this.$showLoading('上传中')
                Promise.all(resset).then((result) => {
                  if (result.every(item => item)) {
                    this.$hideLoading()
                    this.$toast.success('上传成功！')
                    this.resetFileList()
                  }
                })
              } else {
                this.$toast('请选择文件！')
              }
            }
          })
          break
      }
    },
    // 文件删除
    DeleteFileWrap () {
      this.$showModal('提示', '确认删除该文件？').then(() => {
        const params = {
          fileKey: this.data.optFile.key
        }
        DeleteFile(params).then((result) => {
          this.$toast.success('删除成功！')
          this.resetFileList()
        }).catch((err) => {
          this.$toast('删除失败！')
        });
      }).catch((err) => {
      });
    },
    onUploadImg () {
      this.uploadImg()
    },
    clearInput () {
      this.setData({
        fileName: ''
      })
    },
  },
  lifetimes: {
    detached () {
      if (this.downloadTask) {
        this.downloadTask.abort()
        wx.hideLoading()
      }
    }
  }
})