import request from '@/utils/request'

export function getData() {
  return request({
    url: '/get-data',
    method: 'get'
  })
}