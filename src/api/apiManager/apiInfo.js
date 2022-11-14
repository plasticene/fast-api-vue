import request from '@/utils/request'

export function getApiInfoList(query) {
    return request({
        url: "/fds/api/info",
        method: "get",
        params: query
    })
}