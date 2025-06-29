import request from '@/utils/request.js';

export const getRoomListService = (query) => {
    const params = new URLSearchParams();
    params.append("parkId", query["parkId"]);
    params.append("buildingId", query["buildingId"]);
    params.append("floor", query["floor"]);
    return request.get('/room/list', params)
}

