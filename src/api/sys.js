import request from "@/utils/request.js";
import {ref} from "vue";

export const addUserService = (user)=> {
    return request.post('/systemAdmin/addUser', user)
}

export const addParkService = (park)=>{
    const params = new URLSearchParams();
    for (let key in park) {
        params.append(key, park[key]);
    }
    return request.post('/park/add', params)
}
export const addBuildingService = (building)=>{
    const params = new URLSearchParams();
    for (let key in building) {
        params.append(key, building[key]);
    }
    console.log(building)
    return request.post('/building/add',params)
}

export const addUserList = (formData)=>
    request.post('/systemAdmin/addUserWithExcel',formData)

export const addAdmin=(user)=>request.post('/systemAdmin/addAdmin',user)

export const userList=(page)=>request.get('/systemAdmin/userPageList',{params:page})