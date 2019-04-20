import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/post',
    method: 'get',
    params
  })
}

export function del(id) {
  return request({
    url: '/post',
    method: 'delete',
    params: { id: id }
  })
}

export function add(params) {
  return request({
    url: '/post',
    method: 'post',
    params
  })
}

export function modify(params) {
  return request({
    url: '/post',
    method: 'put',
    params
  })
}

