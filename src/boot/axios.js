import Vue from 'vue'
import axios from 'axios'
import { Loading, Notify } from 'quasar'
import LZString from 'lz-string'

// We create our own axios instance and set a custom base URL.
// Note that if we wouldn't set any config here we do not need
// a named export, as we could just `import axios from 'axios'`
const axiosInstance = axios.create({
  baseURL: process.env.API,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('bear') ? JSON.parse(LZString.decompress(localStorage.getItem('bear'))) : null}`
  }
})

axiosInstance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  Loading.hide()

  if (response.data.message) {
    Notify.create({
      type: 'positive',
      position: 'top',
      message: response.data.message
    })
  }

  return response
}, error => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  Loading.hide()

  if (error.response.data.errors) {
    for (var k in error.response.data.errors) {
      Notify.create({
        type: 'negative',
        position: 'top',
        message: error.response.data.errors[k]
      })
    }
  } else if (error.response.data.error) {
    Notify.create({
      type: 'negative',
      position: 'top',
      message: error.response.data.error
    })
  } else {
    const code = parseInt(error.response.status)
    let msg
    if (code === 401) {
      msg = 'Requisição não autorizada.'
    } else if (code === 403) {
      msg = 'Requisição não permitida.'
    } else if (code === 404) {
      msg = 'Requisição não encontrada.'
    } else if (code === 422) {
      msg = 'Requisição não processada.'
    } else if (code === 500) {
      msg = 'Erro.'
    }
    Notify.create({
      type: 'negative',
      position: 'top',
      message: msg
    })
  }

  return Promise.reject(error)
})

Vue.prototype.$axios = axiosInstance
