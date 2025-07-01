import request from "@/utils/request.js";

export const aplAudit = (id) => request.get('leader/audit',{params:id})

export const makeReject = (id)=>request.post('leader/reject',id)

export const disciplinaryList = (query)=>request.get('/disciplinary/pageList',{params:query})

export const setScore = (record) =>{
    const params = new URLSearchParams();
    params.append('disciplinaryId',record.disciplinaryId)
    params.append('score',record.score)
    return request.post('/disciplinary/setScore',params)
}

