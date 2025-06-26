import request from '@/utils/request.js';

export const getDorApl = (state)=>request.get('dormitory/apl',{params:state})

export const aplExert = (id)=>request.post('dormitory/exert',id)

export const mainAllocate = (query)=>request.post('dormitory/allocate',query)

export const getStaffsList = ()=>request.get('dormitory/staffs')