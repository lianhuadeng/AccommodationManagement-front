import request from "@/utils/request.js";

export const bedPageListService = (query) => {
    return request.get('/bed/pageList', {params: query})
}