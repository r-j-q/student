import { getToken, removeToken } from './auth'
import { getParams, getParamsObj } from './index.js'
import axiosInstance from './axiosSetting'
import router from '../router/MovieRecommend/index'
const baseApi = 'http://127.0.0.1:9999'
const axios = axiosInstance
const qs = require('qs');
// let headers={
// 	'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
// }
function request(url, data = {}, method) {
	return new Promise((resolve, reject) => {
		return axios({
			method,
			url: baseApi + url,
			data: qs.stringify(data),
			timeout: 50000,
			withCredentials: true
		}).then(res => {
			if (res.data.msg == '请先登录') {
				removeToken()
				console.log(this.$router, router, '是否生效')
			} else {
				resolve(res)
			}
		}).catch(err => {
			console.log('是否失败')
			reject(err)
		})
	})
}

//post请求
export const post = (url, data) => {
	return request(url, data, 'POST')
}

//get请求
export const get = (url, data) => {
	if (data) {
		url = url + getParams(data)
		console.log(url)
		return request(url, {}, 'GET')
	} else {
		return request(url, data, 'GET')
	}
}

//put请求
export const put = (url, data) => {
	return request(url, data, 'PUT')
}

//del请求
export const del = (url, data) => {
	if (data) {
		url = url + getParams(data)
		console.log(url)
		return request(url, {}, 'DELETE')
	} else {
		return request(url, data, 'DELETE')
	}
}
