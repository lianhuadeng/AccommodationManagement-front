import request from "@/utils/request.js";

export const getMain = (status)=>{

    return request.get('/repair/maintenanceAdminRepairs',{params:status})
}

export const mainExert=(repairId)=>{
    const params = new URLSearchParams()
    params.append('repairId',repairId)
    return request.post('repair/maintain',params)
}