import request from '@/utils/request'



export function getMenuList(query) {
    return request({
        url: 'fds/menu',
        method: 'get',
        params: query
    })
}

export function addMenu(data) {
    return request({
        url: 'fds/menu',
        method: 'post',
        data: data
    })
}

export function updateMenu(data) {
    return request({
        url: 'fds/menu/' + data.id,
        method: 'put',
        data: data
    })
}

export function deleteMenu(id) {
    return request({
        url: 'fds/menu/' + data.id,
        method: 'delete'
    })
}