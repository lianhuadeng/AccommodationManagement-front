import request from '@/utils/request.js';

export const getBuildingListService = (parkId) => {
    return request.get('/building/list', { params: { parkId } })
}

export const getFloorNumService = (buildingId) => {
    return request.get('/building/getFloorNum', { params: { buildingId } })
}

export const getManagedBuildingService = () => {
    return request.get('/building/getManagedBuilding')
}