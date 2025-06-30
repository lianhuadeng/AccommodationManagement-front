import request from '@/utils/request.js';


export const getUserInfo = () =>request.get('/userInfo')

export const checkSubmit = () => request.get('/user/info')

export const makeAppSubmit = (query) => request.post('user/info',query)

export const applicationPageList = (aplPage)=> request.get('user/application',{params:aplPage})

export const getApplication = () => request.get('user/myapplication')

export const getMaintenance = () =>request.get('user/maintenance')

export const makeMaiSubmit = (query)=> request.post('user/maintenance',query)

export const getHygiene = (roomId) => request.get('user/hygiene',{params:roomId})

export const getLocationService = (userId) =>{
    return request.get('/getLocationByUserId', { params: { userId } })
}

//修改密码
export const changePasswordService = (passwordData) => {
    return request.post('/changePassword', passwordData);
}

//更新用户信息
export const updateContactService = (contact) => {
    const params = new URLSearchParams();
    params.append('contact', contact);
    return request.post("/updateContact", params )
}
// 用户登录
export const userLoginService = (loginData) => {
    return request.post('/login', loginData);
}


export const getUserNameByTokenService = (token) => {
    return request.get('/user/getUserNameByToken', { params: { token } });
}

export const getUserInfoService = () => {
    return request.get('/userInfo');
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
    return request.post('/logout', params);
};