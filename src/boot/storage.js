import Vue from 'vue'
import LZString from 'lz-string'

const storage = {
  setObj: function (key, obj) {
    return localStorage.setItem(key, LZString.compress(JSON.stringify(obj)))
  },
  getObj: function (key, arr = true) {
    return localStorage.getItem(key) ? JSON.parse(LZString.decompress(localStorage.getItem(key))) : (arr ? [] : {})
  }
}

Vue.prototype.$storage = storage
