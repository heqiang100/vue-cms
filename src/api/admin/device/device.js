import HttpRequest from '@/utils/request'

// 查询
export function getDevice (params = {}) {
  return HttpRequest('/admin/devices/devices', 'get', params)
}

// 查询某个
export function getDeviceById (id) {
  return HttpRequest('/admin/devices/devices/' + id, 'get', {}, false)
}

// 添加
export function addDevice (params = {}) {
  return HttpRequest('/admin/devices/devices', 'post', params)
}

// 修改
export function updateDevice (params = {}) {
  return HttpRequest('/admin/devices/devices/' + params.id, 'put', params)
}
// 删除
export function delDevice (ids) {
  return HttpRequest('/admin/devices/devices/' + ids, 'delete')
}
