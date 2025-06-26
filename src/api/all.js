import request from '@/utils/request.js';

export const myContact = (query)=>request.post('all/contact',query)
