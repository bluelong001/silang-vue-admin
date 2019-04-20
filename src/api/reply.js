import request from '@/utils/request'

export function getReplyList(params) {
  return request({
    url: '/reply',
    method: 'get',
    params
  })
}


export function delReply(id) {
  return request({
    url: '/reply',
    method: 'delete',
    params: { id: id }
  })
}