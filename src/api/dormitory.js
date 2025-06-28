import request from '@/utils/request.js';

export const getDorApl = (state)=>request.get('dormitory/apl',{params:state})

export const aplExert = (id)=>request.post('dormitory/exert',id)//管理员处理

export const mainAllocate = (query)=>request.post('dormitory/allocate',query)//维修分配

export const getStaffsList = ()=>request.get('dormitory/staffs')

export const getDorMain = ()=>request.get('dormitory/main')