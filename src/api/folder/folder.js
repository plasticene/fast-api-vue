import request from '@/utils/request'

export function getFolderListByType(type) {
  return request({
    url: '/fds/folder/list?type=' + type,
    method: 'get'
  })
}

export function addFolder(data) {
  return request({
    url: '/fds/folder',
    method: 'post',
    data: data
  })
}
