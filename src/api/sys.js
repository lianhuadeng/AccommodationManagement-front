import request from "@/utils/request.js";

export const addUserService = (user)=> {
    return request.post('/systemAdmin/addUser', user)
}

export const addAdmin=(user)=>request.post('/systemAdmin/addAdmin',user)

export const userList=(page)=>request.get('/systemAdmin/userPageList',{params:page})