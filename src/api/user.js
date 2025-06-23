import request from '@/utils/request.js';

// 用户注册
export const userRegisterService = (registerData) => {
    // 这里使用URLSearchParams对象来处理请求参数
    const params = new URLSearchParams();
    for (let key in registerData) {
        params.append(key, registerData[key]);
    }
    return request.post('/user/register', params);
}

// 发送验证码
export const sendCodeService = (email) => {
    const params = new URLSearchParams();
    params.append('email', email);
    return request.post('/user/sendCode', params);
}

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

export const getUserContactService = (userID) => {
    return request.get('/user/getUserContact', { params: { userID } });
}

export const getUserEmailService = (userID) => {
    return request.get('/user/getUserEmail', { params: { userID } });
}

export const getUserInfoService = () => {
    return request.get('/user/userInfo');
}

export const changePasswordService = (passwordData, token) => {
    const params = new URLSearchParams();
    for (let key in passwordData) {
        params.append(key, passwordData[key]);
    }
    params.append('token', token);
    return request.patch('/user/updatePassword', params);
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