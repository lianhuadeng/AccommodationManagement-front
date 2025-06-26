import request from "@/utils/request.js";

export const getMain = (type)=>request.get('maintenance/list',{params:type})

export const mainExert=(id)=>request.post('maintenance/make',id)