import request from '@/utils/request.js';

export const recentLostItemsService = () => {
    return request.get('/lostItem/getRecentLostItems')
}

export const myLostItemsService = () => {
    // const tokenStore = useTokenStore();
    // return request.get('/lostItem/myLostItems', { headers: { 'Authorization': tokenStore.token } })
    return request.get('/lostItem/myLostItems')
}

export const addLostItemService = (data) => {
    return request.post('/lostItem/addLostItem', data)
}

export const updateLostItemService = (data) => {
    return request.patch('/lostItem/updateLostItem', data)
}

export const deleteLostItemService = (lostID) => {
    return request.delete('/lostItem/deleteLostItem', { params: { lostID } })
}

export const lostItemListService = (params) => {
    return request.get('/lostItem/lostItemList', { params: params })
}