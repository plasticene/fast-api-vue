import request from '@/utils/request'

export function getDataSourceList(query) {
    return request({
        url: '/fds/dataSource',
        method: 'get',
        params: query
    })

}