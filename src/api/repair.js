import request from '@/utils/request.js';

export const myRepairService = () => {
    return request.get('/repair/myRepair')
}

export const submitRepairService = (data) => {
    return request.post('/repair/add', data)
}

export const getAllocatedRepairService = () => {
    return request.get('/repair/getAllocatedRepair')
}

export const getProcessedRepairService = () => {
    return request.get('/repair/getProcessedRepair')
}