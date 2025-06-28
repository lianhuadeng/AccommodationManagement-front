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
