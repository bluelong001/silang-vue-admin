import request from '@/utils/request'

export function upload(params, callback) {
  return request({
    url: '/file/upload',
    method: 'post',
    timeout:100000,
    onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
      if (progressEvent.lengthComputable) {
        callback(progressEvent);
      }
    },
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