import request from '@/utils/request.js';

export const getRoomListService = (query) => {
    const params = {
        parkId: query["parkId"],
        buildingId: query["buildingId"],
        floor: query["floor"]
    };
    return request.get('/room/list', {params})
}

