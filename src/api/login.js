import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/back/login',
    method: 'post',
    data,
    transformDataRequest :true
  })
}

export function getInfo(token) {
  return request({
    url: '/user/get/token',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
