import request from '@/utils/request.js';

export const getDorApl = (state)=>request.get('dormitory/apl',{params:state})

export const aplExert = (id)=>request.post('dormitory/exert',id)//管理员处理

export const mainAllocate = (query)=>{
    const params = new URLSearchParams();
    params.append('repairId', query.repairId);
    params.append('maintenanceId', query.maintenanceId);
    console.log(params)
    return request.post('/repair/allocate',params)
}//维修分配

//获取当前宿舍管理员的楼栋
export const getMyBuilding = ()=>request.get('/building/list2')

//宿管添加违纪记录
export const addDiscipline = (record)=>request.post('/disciplinary/add',record)
