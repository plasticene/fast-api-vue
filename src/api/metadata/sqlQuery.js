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