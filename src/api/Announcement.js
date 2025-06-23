import request from '@/utils/request.js';

export const recentAnnouncementsService = () => {
    return request.get('/announcement/getRecentAnnouncements')
}

export const getAnnouncementListService = () => {
    return request.get('/announcement/getAnnouncementList')
}

export const addAnnouncementService = (data) => {
    return request.post('/announcement/addAnnouncement', data)
}

export const deleteAnnouncementService = (announcementID) => {
    return request.delete('/announcement/deleteAnnouncement', { params: { announcementID } })
}

export const updateAnnouncementService = (data) => {
    return request.post('/announcement/updateAnnouncement', data)
}

