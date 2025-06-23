import request from '@/utils/request.js';

export const categoryNameService = (categoryID) => {
    return request.get('/category/getCategoryName', { params: { categoryID } })
}

export const categoryListService = () => {
    return request.get('/category/getCategoryList')
}