import request from '@/utils/request'

export function getUserList(query) {
  return request({
    url: 'fds/user',
    method: 'get',
    params: query
  })
}

export function addUser(data) {
  return request({
    url: 'fds/user',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: 'fds/user/' + data.id,
    method: 'put',
    data: data
  })
}

export function deleteUser(id) {
  return request({
    url: 'fds/user/' + id,
    method: 'delete'
  })
}

export function assignUser(data) {
  return request({
    url: '/fds/user/role',
    method: 'post',
    data: data
  })
}