import HttpRequest from '@/utils/request'

// 查询
export function getBrand (params = {}) {
  return HttpRequest('/admin/devices/brands', 'get', params)
}

// 查询某个
export function getBrandById (id) {
  return HttpRequest('/admin/devices/brands/' + id, 'get', {}, false)
}

// 添加
export function addBrand (params = {}) {
  return HttpRequest('/admin/devices/brands', 'post', params)
}

// 修改
export function updateBrand (params = {}) {
  return HttpRequest('/admin/devices/brands/' + params.id, 'put', params)
}
// 删除
export function delBrand (ids) {
  return HttpRequest('/admin/devices/brands/' + ids, 'delete')
}
