import request from '@/utils/request.js';

export const myRepairService = () => {
    return request.get('/repair/myRepair')
}
