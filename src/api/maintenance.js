import request from "@/utils/request.js";

export const getStaffList = () => request.get('/maintenanceList')

export const maintenanceList = (status) => {
    const params = new URLSearchParams();
    params.append('status', status);
    return request.post('/repair/dormitoryAdminRepairs', params)
}