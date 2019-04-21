import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/video',
    method: 'get',
    params
  })
}

export function del(id) {
  return request({
    url: '/video',
    method: 'delete',
    params: { id: id }
  })
}

export function add(params) {
  return request({
    url: '/video',
    method: 'post',
    data:params,
    transformDataRequest :true
  })
}

export function modify(params) {
  return request({
    url: '/video',
    method: 'put',
    data:params,
    transformDataRequest :true
  })
}

