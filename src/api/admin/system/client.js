import HttpRequest from '@/utils/request'

// 查询
export function getClient (params = {}) {
  return HttpRequest('/admin/system/client', 'get', params)
}

// 查询某个
export function getClientById (id) {
  return HttpRequest('/admin/system/client/' + id, 'get', {}, false)
}

// 添加
export function addClient (params = {}) {
  return HttpRequest('/admin/system/client', 'post', params)
}

// 修改
export function updateClient (params = {}) {
  return HttpRequest('/admin/system/client/' + params.id, 'put', params)
}
// 删除
export function delClient (ids) {
  return HttpRequest('/admin/system/client/' + ids, 'delete')
}
