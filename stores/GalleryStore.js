import { getGalleryList, getGalleryNum } from '../api/img'

class GalleryStore {

  data = {
    showOptMenu: false,
    galleryList: [],
    allImgGallery: [],
    selectAll () {
      return this.galleryList.every(item => item.checked)
    },
    selectedList () {
      return this.galleryList.filter(item => item.checked).map(item => item.parentId)
    }
  }

  async getGalleryList () {
    try {
      const [{ data: galleryListSource }, { data: galleryNumList }] = await Promise.all([
        getGalleryList(),
        getGalleryNum()
      ])
      const totalNum = galleryNumList.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.num
      }, 0)
      const galleryList = galleryListSource.reduce((previousValue, currentValue) => {
        const {
          filePath,
          parentId,
        } = currentValue
        let galleryName = '全部照片'
        if (filePath !== '/') {
          const strArr = String(filePath).split('/')
          galleryName = strArr.slice(strArr.length - 2, strArr.length - 1)[0]
        }
        const galleryListItem = previousValue.find(item => item.parentId === parentId)
        if (parentId === -1) {
          if (!galleryListItem) {
            previousValue.push({
              galleryName,
              parentId,
              num: totalNum,
              fileList: galleryListSource.sort((a, b) => b.createTime - a.createTime).slice(0, 4),
              checked: false,
            })
          }
        } else {
          if (!galleryListItem) {
            previousValue.push({
              galleryName,
              parentId,
              num: galleryNumList.find(item => item.parentId === parentId).num,
              fileList: [currentValue],
              checked: false,
            })
          } else {
            galleryListItem.fileList.push(currentValue)
          }
        }
        return previousValue
      }, [])
      const rootGalleryIndex = galleryList.findIndex((item, index) => item.parentId === -1)
      if (rootGalleryIndex !== -1) {
        this.data.allImgGallery = galleryList.splice(rootGalleryIndex, 1)
      }
      this.data.galleryList = galleryList
      this.reset()
    } catch (error) {
      console.log(error);
      this.reset()
    }
  }

  checkedAll () {
    this.setGalleryList(this.data.galleryList.map(item => {
      return {
        ...item,
        checked: true,
      }
    }))
    
  }
  unCheckedAll () {
    this.setGalleryList(this.data.galleryList.map(item => {
      return {
        ...item,
        checked: false,
      }
    }))
  }
  setShowOptMenu (val) {
    this.data.showOptMenu = val
    this.update()
  }
  setSelectAll () {
    if (this.data.selectAll) {
      this.unCheckedAll()
    } else {
      this.checkedAll()
    }
  }
  setGalleryList (val) {
    this.data.galleryList = val
    this.update()
  }
  reset () {
    this.data.showOptMenu = false
    this.unCheckedAll()
  }
}

export default new GalleryStore()