import request from '@/utils/request.js';

export const recentMessagesService = () => {
    return request.get('/message/getRecentMessages')
}

export const searchMessageService = (params) => {
    return request.get('/message/searchMessage', { params: params })
}

export const myMessagesService = () => {
    return request.get('/message/myMessages')
}

export const addMessageService = (data) => {
    return request.post('/message/addMessage', data)
}

export const updateMessageService = (data) => {
    return request.patch('/message/updateMessage', data)
}

export const deleteMessageService = (messageID) => {
    return request.delete('/message/deleteMessage', { params: { messageID } })
}