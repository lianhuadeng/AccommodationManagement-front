import request from '@/utils/request.js';

export const getToBeRateDisciplinary = () =>{
    return request.get('/disciplinary/toBeRateDisciplinary')
}
export const setScore = (record) =>{
    const params = new URLSearchParams();
    params.append('disciplinaryId',record.disciplinaryId)
    params.append('score',record.score)
    return request.post('/disciplinary/setScore',params)
}

export const getStudentDisciplinary = ()=>request.get('/disciplinary/myDisciplinary')
