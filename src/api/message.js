import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/message',
    method: 'get',
    params
  })
}

export function del(id) {
  return request({
    url: '/message',
    method: 'delete',
    params: { id: id }
  })
}

export function add(params) {
  return request({
    url: '/message',
    method: 'post',
    data:params,
    transformDataRequest :true
  })
}

