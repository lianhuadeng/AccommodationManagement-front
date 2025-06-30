import request from '@/utils/request.js';

export const myRepairService = () => {
    return request.get('/repair/myRepair')
}

export const submitRepairService = (data) => {
    return request.post('/repair/add', data)
}