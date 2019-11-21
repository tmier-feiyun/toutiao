import axios from 'axios'
import Vue from 'vue'
import router from '@/router'
import JSONbig from 'json-bigint'

// 配置请求跟地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// 给axios配置token
// axios.interceptors.request.use(function (config) {
//   console.log(config)
// let userinfo = window.sessionStorage.getItem('userinfo')
// if (userinfo) {
//   let token = JSON.parse(userinfo).token
//   console.log(token)

//   config.headers.Authorization = 'Bearer ' + token
//   }
//   return config
// }, function (error) {
//   return Promise.reject(error)
// })
// 请求拦截器

axios.interceptors.request.use(function (config) {
  var userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
  }
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    router.push('/login')
  }
  return Promise.reject(error)
})
axios.defaults.transformResponse = function (data) {
  if (data) {
    return JSONbig.parse(data)
  } else {
    return data
  }
}
Vue.prototype.$http = axios
