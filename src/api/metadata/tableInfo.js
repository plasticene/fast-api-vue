// 其实这里的接口也是数据源下的，放在dataSource.js下也是可以的，但是为了方便维护，清楚了然，组件和接口js文件一一对应我们就放到这里

import request from '@/utils/request'

export function getTableList(data) {
  return request({
    url: '/fds/dataSource/database/table',
    method: 'get',
    params: data
  })
}

export function getTableStruct(data) {
  return request({
    url: '/fds/dataSource/table/struct',
    method: 'get',
    params: data
  })
}

export function getTableData(data) {
  return request({
    url: '/fds/dataSource/table/data',
    method: 'get',
    params: data
  })
}
