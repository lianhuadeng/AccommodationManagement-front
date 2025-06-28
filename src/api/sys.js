import request from "@/utils/request.js";

export const addUser=(user)=>request.post('/system/add',user)