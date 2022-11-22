import request from '@/utils/request'

// api列表
export function getApiInfoList(query) {
  return request({
    url: '/fds/api/info',
    method: 'get',
    params: query
  })
}

// 查询api详情
export function getApiInfo(id) {
  return request({
    url: '/fds/api/info/' + id,
    method: 'get'
  })
}

// 添加api
export function addApiInfo(data) {
  return request({
    url: '/fds/api/info',
    method: 'post',
    data: data
  })
}

// api冒烟测试
export function somkeTest(id) {
  return request({
    url: '/fds/api/info/smoke/' + id,
    method: 'post'
  })
}

// 修改api
export function updateApi(data) {
  return request({
    url: '/fds/api/info/' + data.id,
    method: 'put',
    data: data
  })
}

// 发布api
export function releaseApi(id) {
  return request({
    url: '/fds/api/info/release/' + id,
    method: 'post'
  })
}

// 下线api
export function offlineApi(id) {
  return request({
    url: '/fds/api/info/offline/' + id,
    method: 'post'
  })
}

