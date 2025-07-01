import request from '@/utils/request.js';


export const getUserInfo = () =>request.get('/userInfo')


export const getApplication = () => request.get('user/myapplication')

export const getMaintenance = () =>request.get('user/maintenance')


export const getHygiene = (roomId) => request.get('user/hygiene',{params:roomId})

export const getCurrentUserLocationService = () =>{
    return request.get('/getCurrentUserLocation')
}

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

export const getUserInfoService = () => {
    return request.get('/userInfo');
}

export const updatePhoneService = (phone) => {
    return request.patch('/user/updatePhone', null, { params: { phone } });
};

export const userLogoutService = (token) => {
    const params = new URLSearchParams();
    params.append('token', token);
    return request.post('/logout', params);
};

export const getUserPageListService = (query) => {
    const params = {
        pageNum: query.pageNum,
        pageSize: query.pageSize,
        type: query.type
    }
    return request.get('/systemAdmin/userPageList', { params })
}

export const getMaintenanceAdminListService = () => {
    return request.get('/maintenanceList')
}