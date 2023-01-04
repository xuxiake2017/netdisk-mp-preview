class GlobalStore {

  data = {
    isAuth: null,
    showNoAuth() {
      return this.isAuth !== null && this.isAuth === false
    },
  }
}

export default new GlobalStore()