import request from '@/utils/request'

export function upload(params) {
    return request({
      url: '/file/upload',
      method: 'post',
      headers:{'Content-Type':'multipart/form-data'},
      data:params
    })
}
  