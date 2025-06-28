import request from '@/utils/request.js';

export const myContact = (contact)=>request.post('all/contact',contact)
