import request from "@/utils/request.js";

export const bedPageListService = (query) => {
    const params = {
        pageNum: query["pageNum"],
        pageSize: query["pageSize"],
        parkId: query["parkId"],
        buildingId: query["buildingId"],
        floor: query["floor"],
        roomId: query["roomId"],
    };
    return request.get('/bed/pageList', {params})
}