import request from '@/utils/request'

export function getRoleList(query) {
    return request({
        url: 'fds/role',
        method: 'get',
        params: query
    })
}

export function addRole(data) {
    return request({
        url: 'fds/role',
        method: 'post',
        data: data
    })
}

export function updateRole(data) {
    return request({
        url:'fds/role/' + data.id,
        method: 'put',
        data: data
    })
}

export function deleteRole(id) {
    return request({
        url: 'fds/role/'+id,
        method: 'delete'
    })
}