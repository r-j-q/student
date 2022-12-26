/*
 *    Copyright (c) 2018-2025, hz All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: hz
 */
import request from '@/router/axios'
import qs from 'qs'
import store from '@/store'
import {getStore, setStore} from "@/util/store.js";
import website from "@/const/website.js";

const scope = 'server'

export const loginByUsername = (username, password, code, randomStr) => {
  let grant_type = 'password'
  let dataObj = qs.stringify({'username': username, 'password': password})
  let basicAuth = 'Basic ' + window.btoa(website.formLoginClient)

  // 保存当前选中的 basic 认证信息
  setStore({
    name: 'basicAuth',
    content: basicAuth,
    type: 'session'
  })

  return request({
    url: '/admin/oauth/token',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      'Authorization': basicAuth
    },
    method: 'post',
    params: {randomStr, code, grant_type},
    data: dataObj
  })
}

export const refreshToken = (refresh_token) => {
  const grant_type = 'refresh_token'
  // 获取当前选中的 basic 认证信息
  let basicAuth = getStore({name: 'basicAuth'})

  return request({
    url: '/admin/oauth/token',
    headers: {
      'isToken': false,
      'TENANT-ID': '1',
      'Authorization': basicAuth
    },
    method: 'post',
    params: {refresh_token, grant_type, scope}
  })
}

export const loginByMobile = (mobile, code) => {
  const grant_type = 'mobile'
  let basicAuth = 'Basic ' + window.btoa(website.smsLoginClient)

  // 保存当前选中的 basic 认证信息
  setStore({
    name: 'basicAuth',
    content: basicAuth,
    type: 'session'
  })

  return request({
    url: '/admin/oauth/token',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      'Authorization': basicAuth
    },
    method: 'post',
    params: {mobile: 'SMS@' + mobile, code: code, grant_type}
  })
}

export const loginBySocial = (state, code) => {
  const grant_type = 'mobile'
  let basicAuth = 'Basic ' + window.btoa(website.socialLoginClient)

  // 保存当前选中的 basic 认证信息
  setStore({
    name: 'basicAuth',
    content: basicAuth,
    type: 'session'
  })

  return request({
    url: '/admin/oauth/token',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      'Authorization': basicAuth
    },
    method: 'post',
    params: {mobile: state + '@' + code, code: code, grant_type}
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export const logout = () => {
  return request({
    url: '/admin/token/logout',
    method: 'delete'
  })
}

/**
 * 校验令牌，若有效期小于半小时自动续期
 * @param refreshLock
 */
export const checkToken = (refreshLock, $store) => {
  const token = store.getters.access_token
  // 获取当前选中的 basic 认证信息
  let basicAuth = getStore({name: 'basicAuth'})

  request({
    url: '/admin/oauth/check_token',
    headers: {
      isToken: false,
      Authorization: basicAuth
    },
    method: 'get',
    params: {token}
  }).then(response => {
    const expire = response && response.data && response.data.exp
    if (expire) {
      const expiredPeriod = expire * 1000 - new Date().getTime()
      //小于半小时自动续约
      if (expiredPeriod <= 30 * 60 * 1000) {
        if (!refreshLock) {
          refreshLock = true
          $store.dispatch('RefreshToken')
            .catch(() => {
              clearInterval(this.refreshTime)
            })
          refreshLock = false
        }
      }
    }
  }).catch(error => {
    console.error(error)
  })
}

/**
 * 注册用户
 */
export const registerUser = (userInfo) => {
  return request({
    url: '/admin/register/user',
    method: 'post',
    data:userInfo
  })
}
