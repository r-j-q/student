import axios from 'axios'
import qs from 'qs'
axios.defaults.timeout = 50000
// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// HTTPrequest拦截
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  const csrf_token = localStorage.getItem('X-CSRFToken')
  if (token) {
    config.headers['authToken'] = ' ' + token// token
    config.headers['X-CSRFToken'] = ' ' + csrf_token// token
  }

  // headers中配置serialize为true开启序列化  
  // if (config.method === 'post' && config.headers.serialize) {
  //   config.data = serialize(config.data)
  //   delete config.data.serialize
  // }

  if (config.method === 'get') {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
axios.interceptors.response.use(
  response => {
    //拦截响应，做统一处理
    return response
  },
  //接口错误状态处理，也就是说无响应时的处理
  error => {
    return Promise.reject(error) // 返回接口返回的错误信息
  })
export default axios
