import request from '@/utils/request.js';

export const getParkListService = () => {
    return request.get('/park/list')
}