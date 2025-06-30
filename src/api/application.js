import request from '@/utils/request.js';

export const cancelApplicationService = (applicationId) => {
    const params = new URLSearchParams();
    params.append('applicationId', applicationId);
    return request.post("/application/cancel", params)
}

//获取用户宿舍调整申请
export const myApplicationService = () => {
    return request.get('/application/myApplication')
}

export const submitApplicationService = (data) => {
    return request.post('/application/add', data)
}

export const getApplicationListService = (query) => {
    const params = {
        pageNum: query.pageNum,
        pageSize: query.pageSize,
    }
    return request.get('/application/pageList', { params })
}