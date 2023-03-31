import create from 'mini-stores'
import { behavior as computedBehavior } from 'miniprogram-computed';

import commonBehaviors from '../../../../common/behaviors/commonBehaviors';
import GalleryStore from '../../../../stores/GalleryStore';

const stores = {
  '$gallery': GalleryStore,
}

create.Component(stores, {

  behaviors: [
    commonBehaviors,
    computedBehavior,
  ],
  /**
   * 组件的属性列表
   */
  properties: {
    safeAreaPadding: {
      type: Boolean,
    },
    showOptMenu: {
      type: Boolean,
    }
  },

  options: {
    styleIsolation: 'shared'
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  computed: {
    renameDisabled: data => {
      return data.$gallery.selectedList.length === 0 || data.$gallery.selectedList.length > 1
    },
    deleteDisabled: data => {
      return data.$gallery.selectedList.length === 0
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRename () {
      if (this.data.renameDisabled) return
      this.$emit('rename')
    },
    onDelete () {
      if (this.data.deleteDisabled) return
      this.$emit('delete')
    },
  }
})
