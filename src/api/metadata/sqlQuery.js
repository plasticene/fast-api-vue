import request from '@/utils/request'

export function executeSql(data) {
  return request({
    url: '/fds/sql/query/execute',
    method: 'post',
    data: data
  })
}

export function addSqlQuery(data) {
  return request({
    url: '/fds/sql/query',
    method: 'post',
    data: data
  })
}

export function updateSqlQuery(data) {
  return request({
    url: '/fds/sql/query/' + data.id,
    method: 'put',
    data: data
  })
}

export function getSqlQueryList(query) {
  return request({
    url: '/fds/sql/query',
    method: 'get',
    params: query
  })
}

export function getSqlQueryDetail(id) {
  return request({
    url: '/fds/sql/query/' + id,
    method: 'get'
  })
}

