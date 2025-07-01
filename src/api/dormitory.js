import request from '@/utils/request.js';

//添加卫生检查记录
export const addHygieneCheck =(record)=>request.post('/hygiene/add',record)

//获取当前宿舍管理员的楼栋
export const getMyBuilding = ()=>request.get('/building/list2')

//宿管添加违纪记录
export const addDiscipline = (record)=>request.post('/disciplinary/add',record)
