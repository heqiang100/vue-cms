import HttpRequest from '@/utils/request'

// 查询
export function getVersion (params = {}) {
  return HttpRequest('/admin/devices/versions', 'get', params)
}

// 查询某个
export function getVersionById (id) {
  return HttpRequest('/admin/devices/versions/' + id, 'get', {}, false)
}

// 添加
export function addVersion (params = {}) {
  return HttpRequest('/admin/devices/versions', 'post', params)
}

// 修改
export function updateVersion (params = {}) {
  return HttpRequest('/admin/devices/versions/' + params.id, 'put', params)
}
// 删除
export function delVersion (ids) {
  return HttpRequest('/admin/devices/versions/' + ids, 'delete')
}
