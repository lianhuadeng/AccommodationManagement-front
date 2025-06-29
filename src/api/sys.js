import request from "@/utils/request.js";

export const addStu=(user)=>request.post('/systemAdmin/addStudent',{user})

export const addAdmin=(user)=>request.post('/systemAdmin/addAdmin',user)

export const userList=(page)=>request.get('/systemAdmin/userPageList',{params:page})