import request from '@/utils/request.js';

export const recentFoundItemsService = () => {
    return request.get('/foundItem/getRecentFoundItems')
}

export const myFoundItemsService = () => {
    return request.get('/foundItem/myFoundItems')
}

export const addFoundItemService = (data) => {
    return request.post('/foundItem/addFoundItem', data)
}

export const updateFoundItemService = (data) => {
    return request.patch('/foundItem/updateFoundItem', data)
}

export const deleteFoundItemService = (foundID) => {
    return request.delete('/foundItem/deleteFoundItem', { params: { foundID } })
}

export const foundItemListService = (params) => {
    return request.get('/foundItem/foundItemList', { params: params })
}

export const getClaimedFoundItemsService = (params) => {
    return request.get('/foundItem/getClaimedFoundItems', { params: params })
}