import request from '@/utils/request'

export function getList(params) {
    return request({
      url: '/reply',
      method: 'get',
      params
    })
  }

  export function del(params) {
    return request({
      url: '/video',
      method: 'delete',
      params
    })
  }
  
  export function add(params) {
    return request({
      url: '/video',
      method: 'post',
      params
    })
  }
  
  export function modify(params) {
    return request({
      url: '/video',
      method: 'put',
      params
    })
  }
  