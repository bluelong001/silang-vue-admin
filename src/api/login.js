import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    params: {
      username:username,
      password:password
    }
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
