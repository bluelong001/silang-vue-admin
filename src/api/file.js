import request from '@/utils/request'

export function upload(params) {
  return request({
    url: '/file/upload',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: params
  })
}

export function download(params) {
  return request({
    url: '/file/down',
    method: 'get',
    params
  })
}

export function getUrl(params) {
  return request({
    url: '/file',
    method: 'get',
    params
  })
}