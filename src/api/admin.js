import request from '@/utils/request.js';

// 发送验证码
export const sendCodeService = (email) => {
    const params = new URLSearchParams();
    params.append('email', email);
    return request.post('/admin/sendCode', params);
}

export const checkEmailService = (email) => {
    return request.get('/admin/checkEmail', { params: { email } });
};

export const checkCodeService = (data) => {
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.get('/admin/checkCode', { params });
};
// get 加{}, post 不加
export const forgetPasswordService = (data) => {
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.post('/admin/forgetPassword', params);
};

export const adminLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }
    return request.post('/admin/login', params);
}

export const getAdminNameService = () => {
    return request.get('/admin/getAdminName');
}

export const getFoundItemListService = () => {
    return request.get('/admin/FoundItemList');
}

export const getLostItemListService = () => {
    return request.get('/admin/LostItemList');
}

export const getMessageListService = () => {
    return request.get('/admin/MessageList');
}

export const approveFoundItemService = (foundID) => {
    const params = new URLSearchParams();
    params.append('foundID', foundID);
    return request.post('/admin/approveFoundItem', params);
}
export const approveLostItemService = (lostID) => {
    const params = new URLSearchParams();
    params.append('lostID', lostID);
    return request.post('/admin/approveLostItem', params);
}

export const rejectFoundItemService = (reviewData) => {
    const params = new URLSearchParams();
    params.append('foundID', reviewData['foundID']);
    params.append('reason', reviewData['reason']);
    return request.post('/admin/rejectFoundItem', params);
}
export const rejectLostItemService = (reviewData) => {
    const params = new URLSearchParams();
    params.append('lostID', reviewData['lostID']);
    params.append('reason', reviewData['reason']);
    return request.post('/admin/rejectLostItem', params);
}
export const getAdminListService = () => {
    return request.get('/admin/getAdminList');
}

export const getUserListService = () => {
    return request.get('/admin/getUserList');
}

export const banUserService = (userID) => {
    const params = new URLSearchParams();
    params.append('userID', userID);
    return request.post('/admin/banUser', params);
}

export const unbanUserService = (userID) => {
    const params = new URLSearchParams();
    params.append('userID', userID);
    return request.post('/admin/unbanUser', params);
}

export const deleteMessageService = (messageID) => {
    return request.delete('/admin/deleteMessage', { params: { messageID } });
}

export const getFilterFoundItemService = () => {
    return request.get('/admin/filterFoundItem');
}

export const getFilterLostItemService = () => {
    return request.get('/admin/filterLostItem');
}

export const sendEmailRemindLostItemService = (lostID) => {
    const params = new URLSearchParams();
    params.append('lostID', lostID);
    return request.post('/admin/sendEmailRemind/lostItem', params);
}

export const sendEmailRemindFoundItemService = (foundID) => {
    const params = new URLSearchParams();
    params.append('foundID', foundID);
    return request.post('/admin/sendEmailRemind/foundItem', params);
}

export const sendEmailRemindAllLostItemService = () => {
    return request.post('/admin/sendEmailRemind/allLostItem');
}

export const sendEmailRemindAllFoundItemService = () => {
    return request.post('/admin/sendEmailRemind/allFoundItem');
}

export const deleteLostItemService = (lostID) => {
    return request.delete('/admin/deleteLostItem', { params: { lostID } });
}

export const deleteFoundItemService = (foundID) => {
    return request.delete('/admin/deleteFoundItem', { params: { foundID } });
}

export const adminLogoutService = (token) => {
    const params = new URLSearchParams();
    params.append('token', token);
    return request.post('/admin/logout', params);
}