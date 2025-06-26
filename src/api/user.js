import request from '@/utils/request.js';

export const roomPageList = (query) =>request.get('/room/pageList',{params:query})

export const getUserInfo = (id) =>request.get('/user/info',{params:id})

export const checkSubmit = (id) => request.get('/user/info',{params:id})

export const makeAppSubmit = (query) => request.post('user/info',query)

export const applicationPageList = (aplPage)=> request.get('user/application',{params:aplPage})

export const getApplication = (id) => request.get('user/myapplication',{params:id})

export const cancelApl = (id) => request.post('user/cancel',id)

export const getMaintenance = (id) =>request.get('user/maintenance',{params:id})

export const makeMaiSubmit = (query)=> request.post('user/maintenance',query)

export const getHygiene = (roomId) => request.get('user/hygiene',{params:roomId})
// 用户登录
export const userLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }
    return request.post('/user/login', params);
}

// 根据用户ID获取用户名
export const getUserNameByIdService = (userID) => {
    return request.get('/user/getUserName', { params: { userID } });
}

export const getUserNameByTokenService = (token) => {
    return request.get('/user/getUserNameByToken', { params: { token } });
}

export const getUserInfoService = () => {
    return request.get('/user/userInfo');
}


export const changeEmailService = (emailData, token) => {
    const params = new URLSearchParams();
    for (let key in emailData) {
        params.append(key, emailData[key]);
    }
    params.append('token', token);
    return request.patch('/user/updateEmail', params);
}

export const updatePhoneService = (phone) => {
    return request.patch('/user/updatePhone', null, { params: { phone } });
};

export const claimService = (claimData) => {
    const params = new URLSearchParams();
    for (let key in claimData) {
        params.append(key, claimData[key]);
    }
    return request.post('/user/claim', params);
};

export const checkEmailService = (email) => {
    return request.get('/user/checkEmail', { params: { email } });
};

export const checkCodeService = (data) => {
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.get('/user/checkCode', { params });
};
// get 加{}, post 不加
export const forgetPasswordService = (data) => {
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.post('/user/forgetPassword', params);
};

export const foundLostItemService = (lostID) => {
    const params = new URLSearchParams();
    params.append('lostID', lostID);
    return request.post('/user/found', params);
};

export const userLogoutService = (token) => {
    const params = new URLSearchParams();
    params.append('token', token);
    return request.post('/user/logout', params);
};