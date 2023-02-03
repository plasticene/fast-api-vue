import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: 'fds/user',
    method: 'get',
    params: query
  })
}