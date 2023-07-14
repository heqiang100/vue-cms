import HttpRequest from '@/utils/request'

// 上传头像
export function uploadAvatar (params = {}) {
  return HttpRequest('/upload', 'post', params)
}

// 上传图片
export function uploadImg (params = {}) {
  return HttpRequest('/upload', 'post', params)
}

// 上传文件
export function uploadFile (params = {}) {
  return HttpRequest('/upload', 'post', params)
}
