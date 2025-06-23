import request from '@/utils/request.js';

export const getClaimerEmailByFoundIDService = (foundID) => {
    return request.get('/claimRecord/getClaimerEmailByFoundID', { params: { foundID } });
}

export const getClaimerPhoneByFoundIDService = (foundID) => {
    return request.get('/claimRecord/getClaimerPhoneByFoundID', { params: { foundID } });
}

export const getClaimerNameByFoundIDService = (foundID) => {
    return request.get('/claimRecord/getClaimerNameByFoundID', { params: { foundID } });
}