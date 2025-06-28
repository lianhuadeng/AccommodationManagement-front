import request from "@/utils/request.js";

export const getMain = (state)=>request.get('maintenance/list',{params:state})

export const mainExert=(id)=>request.post('maintenance/make',id)