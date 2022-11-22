import request from '@/utils/request'

// 获取数据源列表接口
export function getDataSourceList(query) {
  return request({
    url: '/fds/dataSource',
    method: 'get',
    params: query
  })
}

// 获取所有可用的数据源
export function getOpenDataSourceList() {
  return request({
    url: '/fds/dataSource/list',
    method: 'get'
  })
}

// 检测数据源是否可以连接
export function checkConnection(data) {
  return request({
    url: '/fds/dataSource/test',
    method: 'post',
    data: data
  })
}

// 添加数据源
export function addDataSource(data) {
  return request({
    url: '/fds/dataSource',
    method: 'post',
    data: data
  })
}

// 更新数据源
export function updateDataSource(data) {
  return request({
    url: '/fds/dataSource/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除数据源(支持批量或者一个， 传数组)
export function delDataSource(ids) {
  return request({
    url: '/fds/dataSource',
    method: 'delete',
    data: ids
  })
}

// 调整数据源状态（批量）
export function changeDataSourceStatus(data) {
  return request({
    url: '/fds/dataSource/status',
    method: 'put',
    data: data
  })
}

