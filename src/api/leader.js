import request from "@/utils/request.js";

export const aplAudit = (id) => request.get('leader/audit',{params:id})

export const makeReject = (id)=>request.post('leader/reject',id)