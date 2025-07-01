import request from '@/utils/request.js';

//添加卫生检查记录
export const addHygieneCheckService = (record) => {
    return request.post('/hygiene-check/add', record)
}